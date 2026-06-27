-- ===========================================
-- NovaLobster HRMS Database Schema
-- Version: 1.0
-- ===========================================

CREATE TABLE companies (

    id SERIAL PRIMARY KEY,

    company_name VARCHAR(255) NOT NULL,

    company_email VARCHAR(255) UNIQUE NOT NULL,

    registration_number VARCHAR(100) UNIQUE NOT NULL,

    phone_number VARCHAR(30),

    address TEXT,

    company_logo_url TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE users (

    id SERIAL PRIMARY KEY,

    company_id INTEGER NOT NULL,

    username VARCHAR(100) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    role VARCHAR(50) NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id)

);

CREATE TABLE leave_requests (

    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    company_id INTEGER NOT NULL,

    leave_type VARCHAR(100) NOT NULL,

    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    reason TEXT,

    attachment_url TEXT,

    status VARCHAR(30) DEFAULT 'pending',

    approved_by INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_leave_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT fk_leave_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id),

    CONSTRAINT fk_leave_approved_by
        FOREIGN KEY (approved_by)
        REFERENCES users(id)

);

CREATE TABLE audit_logs (

    id SERIAL PRIMARY KEY,

    user_id INTEGER,

    company_id INTEGER,

    action VARCHAR(255),

    target_table VARCHAR(100),

    target_id INTEGER,

    details TEXT,

    ip_address VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT fk_audit_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id)

);