ALTER TABLE leave_requests
RENAME COLUMN approved_by TO reviewed_by;

ALTER TABLE leave_requests
RENAME COLUMN approved_at TO reviewed_at;