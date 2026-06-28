BEGIN;

ALTER TABLE public.leave_requests
    ADD COLUMN IF NOT EXISTS request_number VARCHAR(100),
    ADD COLUMN IF NOT EXISTS attachment_url TEXT,
    ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS rejected_reason TEXT,
    ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- Cloud currently has no leave records.
-- This fallback also protects any unexpected legacy rows.
UPDATE public.leave_requests
SET request_number = CONCAT('LEGACY-LV-', id)
WHERE request_number IS NULL
   OR BTRIM(request_number) = '';

UPDATE public.leave_requests
SET
    status = COALESCE(NULLIF(LOWER(BTRIM(status)), ''), 'pending'),
    created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
    updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM public.leave_requests
        WHERE CHAR_LENGTH(leave_type) > 50
    ) THEN
        RAISE EXCEPTION
            'Cannot continue: leave_type exceeds 50 characters.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.leave_requests
        WHERE status NOT IN (
            'pending',
            'approved',
            'rejected',
            'cancelled'
        )
    ) THEN
        RAISE EXCEPTION
            'Cannot continue: unsupported leave request status exists.';
    END IF;
END $$;

ALTER TABLE public.leave_requests
    ALTER COLUMN leave_type TYPE VARCHAR(50),
    ALTER COLUMN request_number SET NOT NULL,
    ALTER COLUMN status TYPE VARCHAR(20),
    ALTER COLUMN status SET DEFAULT 'pending',
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE public.leave_requests
    DROP CONSTRAINT IF EXISTS leave_requests_status_check;

ALTER TABLE public.leave_requests
    ADD CONSTRAINT leave_requests_status_check
    CHECK (
        status IN (
            'pending',
            'approved',
            'rejected',
            'cancelled'
        )
    );

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'leave_requests_request_number_key'
          AND conrelid = 'public.leave_requests'::regclass
    ) THEN
        ALTER TABLE public.leave_requests
            ADD CONSTRAINT leave_requests_request_number_key
            UNIQUE (request_number);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_leave_user'
          AND conrelid = 'public.leave_requests'::regclass
    ) THEN
        ALTER TABLE public.leave_requests
            ADD CONSTRAINT fk_leave_user
            FOREIGN KEY (user_id)
            REFERENCES public.users(id)
            ON DELETE RESTRICT;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_leave_company'
          AND conrelid = 'public.leave_requests'::regclass
    ) THEN
        ALTER TABLE public.leave_requests
            ADD CONSTRAINT fk_leave_company
            FOREIGN KEY (company_id)
            REFERENCES public.companies(id)
            ON DELETE RESTRICT;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_leave_approved_by'
          AND conrelid = 'public.leave_requests'::regclass
    ) THEN
        ALTER TABLE public.leave_requests
            ADD CONSTRAINT fk_leave_approved_by
            FOREIGN KEY (approved_by)
            REFERENCES public.users(id)
            ON DELETE SET NULL;
    END IF;
END $$;

COMMIT;