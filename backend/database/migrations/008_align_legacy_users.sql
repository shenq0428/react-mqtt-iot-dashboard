BEGIN;

-- Old Neon is missing these columns.
-- Local already has them, so it safely skips them.
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
    ADD COLUMN IF NOT EXISTS last_login TIMESTAMP,
    ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP,
    ADD COLUMN IF NOT EXISTS current_session_id UUID,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- Only old Neon has users.password.
-- Copy existing bcrypt hashes into password_hash.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'users'
          AND column_name = 'password'
    ) THEN
        EXECUTE '
            UPDATE public.users
            SET password_hash = password
            WHERE (password_hash IS NULL OR BTRIM(password_hash) = '''')
              AND password IS NOT NULL
              AND BTRIM(password) <> ''''
        ';
    END IF;
END $$;

-- Fill nullable legacy values before adding NOT NULL rules.
UPDATE public.users
SET
    role = COALESCE(NULLIF(BTRIM(role), ''), 'user'),
    status = COALESCE(NULLIF(BTRIM(status), ''), 'active'),
    privilege_type = COALESCE(
        NULLIF(BTRIM(privilege_type), ''),
        'permanent'
    ),
    created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
    updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP);

-- Stop safely rather than creating invalid constraints.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM public.users
        WHERE password_hash IS NULL
           OR BTRIM(password_hash) = ''
    ) THEN
        RAISE EXCEPTION
            'Cannot continue: one or more users have no password_hash.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.users
        WHERE username IS NULL
           OR BTRIM(username) = ''
    ) THEN
        RAISE EXCEPTION
            'Cannot continue: one or more users have an empty username.';
    END IF;

    IF EXISTS (
        SELECT username
        FROM public.users
        GROUP BY username
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION
            'Cannot continue: duplicate usernames exist.';
    END IF;
END $$;

ALTER TABLE public.users
    ALTER COLUMN password_hash SET NOT NULL,
    ALTER COLUMN role DROP DEFAULT,
    ALTER COLUMN role SET NOT NULL,
    ALTER COLUMN status SET DEFAULT 'active',
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN privilege_type SET DEFAULT 'permanent',
    ALTER COLUMN privilege_type SET NOT NULL,
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN updated_at SET NOT NULL;

-- Cloud's old status rule is not in the Local target schema.
ALTER TABLE public.users
    DROP CONSTRAINT IF EXISTS check_status;

-- Replace legacy FK with the Local target version.
ALTER TABLE public.users
    DROP CONSTRAINT IF EXISTS fk_company;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'users_username_key'
          AND conrelid = 'public.users'::regclass
    ) THEN
        ALTER TABLE public.users
            ADD CONSTRAINT users_username_key
            UNIQUE (username);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_users_company'
          AND conrelid = 'public.users'::regclass
    ) THEN
        ALTER TABLE public.users
            ADD CONSTRAINT fk_users_company
            FOREIGN KEY (company_id)
            REFERENCES public.companies(id)
            ON DELETE SET NULL;
    END IF;
END $$;

-- Keep legacy users.password for now.
-- It will be removed only after production login is verified.

COMMIT;