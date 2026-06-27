CREATE INDEX idx_users_company
ON users(company_id);

CREATE INDEX idx_users_username
ON users(username);

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_leave_user
ON leave_requests(user_id);

CREATE INDEX idx_leave_company
ON leave_requests(company_id);

CREATE INDEX idx_leave_status
ON leave_requests(status);

CREATE INDEX idx_leave_start_date
ON leave_requests(start_date);

CREATE INDEX idx_leave_end_date
ON leave_requests(end_date);

CREATE INDEX idx_leave_request_number
ON leave_requests(request_number);

CREATE INDEX idx_audit_company
ON audit_logs(company_id);

CREATE INDEX idx_audit_actor
ON audit_logs(actor_user_id);

CREATE INDEX idx_audit_action
ON audit_logs(action);

CREATE INDEX idx_audit_created_at
ON audit_logs(created_at);