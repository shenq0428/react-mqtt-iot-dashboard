BEGIN;

-- Old Neon lacks these columns.
-- Local already has them, so this safely does nothing there.
ALTER TABLE public.companies
    ADD COLUMN IF NOT EXISTS short_name VARCHAR(50),
    ADD COLUMN IF NOT EXISTS industry VARCHAR(100),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- Fill short_name only for legacy rows that do not have one yet.
UPDATE public.companies
SET short_name = CASE company_name
    WHEN 'Nova Lobster Technologies' THEN 'nova-lobster'
    WHEN 'Charizard Industries' THEN 'charizard'
    WHEN 'Blastoise Energy' THEN 'blastoise'
    WHEN 'Rayquaza IoT Solutions' THEN 'rayquaza-iot'
    WHEN 'Pikachu Smart Systems' THEN 'pikachu'
    WHEN 'test' THEN 'test'
    ELSE CONCAT('company-', id)
END
WHERE short_name IS NULL
   OR BTRIM(short_name) = '';

-- Make old nullable values safe before adding NOT NULL rules.
UPDATE public.companies
SET
    status = COALESCE(NULLIF(BTRIM(status), ''), 'active'),
    created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
    updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP);

-- Stop instead of silently creating a broken schema.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM public.companies
        WHERE short_name IS NULL
           OR BTRIM(short_name) = ''
    ) THEN
        RAISE EXCEPTION
            'Cannot continue: one or more companies have no short_name.';
    END IF;

    IF EXISTS (
        SELECT short_name
        FROM public.companies
        GROUP BY short_name
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION
            'Cannot continue: duplicate company short_name values exist.';
    END IF;
END $$;

ALTER TABLE public.companies
    ALTER COLUMN short_name SET NOT NULL,
    ALTER COLUMN status SET DEFAULT 'active',
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN updated_at SET NOT NULL;

-- Local already has this unique constraint; old Neon does not.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'companies_short_name_key'
          AND conrelid = 'public.companies'::regclass
    ) THEN
        ALTER TABLE public.companies
            ADD CONSTRAINT companies_short_name_key
            UNIQUE (short_name);
    END IF;
END $$;

COMMIT;