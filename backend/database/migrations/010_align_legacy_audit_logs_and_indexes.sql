BEGIN;

-- Old Cloud data may have nullable created_at.
UPDATE public.audit_logs
SET created_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL;

-- Check old references before adding foreign keys.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM public.audit_logs al
        LEFT JOIN public.users u
            ON u.id = al.actor_user_id
        WHERE al.actor_user_id IS NOT NULL
          AND u.id IS NULL
    ) THEN
        RAISE EXCEPTION
            'Cannot continue: an audit log references a missing actor user.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.audit_logs al
        LEFT JOIN public.companies c
            ON c.id = al.company_id
        WHERE al.company_id IS NOT NULL
          AND c.id IS NULL
    ) THEN
        RAISE EXCEPTION
            'Cannot continue: an audit log references a missing company.';
    END IF;
END $$;

ALTER TABLE public.audit_logs
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN created_at SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_audit_actor'
          AND conrelid = 'public.audit_logs'::regclass
    ) THEN
        ALTER TABLE public.audit_logs
            ADD CONSTRAINT fk_audit_actor
            FOREIGN KEY (actor_user_id)
            REFERENCES public.users(id)
            ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_audit_company'
          AND conrelid = 'public.audit_logs'::regclass
    ) THEN
        ALTER TABLE public.audit_logs
            ADD CONSTRAINT fk_audit_company
            FOREIGN KEY (company_id)
            REFERENCES public.companies(id)
            ON DELETE SET NULL;
    END IF;
END $$;

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_audit_action
    ON public.audit_logs(action);

CREATE INDEX IF NOT EXISTS idx_audit_actor
    ON public.audit_logs(actor_user_id);

CREATE INDEX IF NOT EXISTS idx_audit_company
    ON public.audit_logs(company_id);

CREATE INDEX IF NOT EXISTS idx_audit_created_at
    ON public.audit_logs(created_at);

-- Leave request indexes
CREATE INDEX IF NOT EXISTS idx_leave_company
    ON public.leave_requests(company_id);

CREATE INDEX IF NOT EXISTS idx_leave_end_date
    ON public.leave_requests(end_date);

CREATE INDEX IF NOT EXISTS idx_leave_request_number
    ON public.leave_requests(request_number);

CREATE INDEX IF NOT EXISTS idx_leave_start_date
    ON public.leave_requests(start_date);

CREATE INDEX IF NOT EXISTS idx_leave_status
    ON public.leave_requests(status);

CREATE INDEX IF NOT EXISTS idx_leave_user
    ON public.leave_requests(user_id);

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_company
    ON public.users(company_id);

CREATE INDEX IF NOT EXISTS idx_users_email
    ON public.users(email);

CREATE INDEX IF NOT EXISTS idx_users_username
    ON public.users(username);

COMMIT;