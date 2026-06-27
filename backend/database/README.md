# NovaLobster Database

This folder contains all database resources for NovaLobster HRMS.

## Folder Structure

database/

├── migrations/

Database version history.

Every database change should be added as a new migration.

Example:

006_add_leave_versioning.sql

---

├── schema/

Current database schema.

Contains the latest database structure.

---

├── seed/

Development fake data.

Never use production data.

---

## Migration Rules

- Never modify old migrations after they have been committed.
- Create a new migration for every database change.
- One migration = One database change.

Example

006_add_leave_versioning.sql

007_add_leave_attachment.sql

008_add_claim_requests.sql

---

## Production Rules

Never commit:

- .env
- Database backups
- Production data
- API Keys
- JWT Secrets
- AWS Credentials