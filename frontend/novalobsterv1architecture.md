═══════════════════════════════════════════════════════════════
                NOVA LOBSTER PLATFORM V1
═══════════════════════════════════════════════════════════════

                        SuperAdmin
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼

  User Management    Company Management    Platform Control
         │                   │                   │
         │                   │                   │
         ▼                   ▼                   ▼

  Manage People      Manage Companies      Audit Logs
                                            Support Tickets
                                            System Settings
                                            Future Billing


═══════════════════════════════════════════════════════════════
                      COMPANY STRUCTURE
═══════════════════════════════════════════════════════════════


                Pikachu Sdn Bhd
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼

  Company Admins                  Users

   ├── Jack                       ├── John
   ├── Sarah                      ├── Tom
   └── Alex                       └── David


═══════════════════════════════════════════════════════════════
                     USER MANAGEMENT
═══════════════════════════════════════════════════════════════

Purpose:
Manage PEOPLE

Database:
users

Functions:

├── View Users
├── Search Users
├── Create User
├── Edit Username
├── Edit Email
├── Change Role
├── Assign Company
└── View User Details


Table Example:

# | Username | Email | Company | Role | Status | Action

1 | John     | xxx   | Pikachu | User | Active | Edit
2 | Jack     | xxx   | Pikachu | Admin | Active | Edit


Future:

Edit User

    Username
    Email
    Company
    Role


═══════════════════════════════════════════════════════════════
                     ACCOUNT CONTROL
═══════════════════════════════════════════════════════════════

Purpose:
Manage ACCOUNT STATUS

NOT User Information

Functions:

├── Reset Password
├── Activate Account
├── Deactivate Account
├── Delete Account
└── Force Logout (Future)


Example:

John

┌──────────────────┐
│ Account Control  │
└──────────────────┘

    Reset Password

    Deactivate Account

    Delete Account


Meaning:

User Management
    = Who the user is

Account Control
    = Can the user login?


═══════════════════════════════════════════════════════════════
                    COMPANY MANAGEMENT
═══════════════════════════════════════════════════════════════

Purpose:
Manage COMPANIES

Database:
companies

Functions:

├── View Companies
├── Search Companies
├── Create Company
├── Edit Company
├── Company Status
├── Assign Company Admin
└── View Company Details


Table Example:

Company      Users   Admins   Status

Pikachu      20      2        Active
Charizard    15      1        Active


Company Details

Company Name

Company Email

Phone Number

Address

Users Count

Admin Count

Subscription Plan (Future)


═══════════════════════════════════════════════════════════════
                       ROLE HIERARCHY
═══════════════════════════════════════════════════════════════


SuperAdmin
    │
    ├── Manage Companies
    ├── Manage Company Admins
    ├── Manage Users
    ├── Audit Logs
    ├── Support Tickets
    └── Full Access


Company Admin
    │
    ├── Manage Company Users
    ├── View Company Dashboard
    ├── View Company Devices
    ├── Create Tickets
    └── Company Scope Only


User
    │
    ├── Dashboard
    ├── Devices
    ├── Profile
    ├── Tickets
    └── Read Only


═══════════════════════════════════════════════════════════════
                   FUTURE MQTT STRUCTURE
═══════════════════════════════════════════════════════════════


Company
   │
   ├── Users
   │
   ├── Devices
   │      ├── Blower 1
   │      ├── Blower 2
   │      ├── Pump 1
   │      └── Pump 2
   │
   ├── MQTT Data
   │
   └── Dashboards


═══════════════════════════════════════════════════════════════
                    CURRENT DEVELOPMENT ROADMAP
═══════════════════════════════════════════════════════════════

✅ Login

✅ JWT Authentication

✅ Protected Routes

✅ Role-Based Navbar

✅ User Management V1

━━━━━━━━━━━━━━━━━━━━

NEXT

□ Edit User

□ Account Control

□ Company Management

□ Audit Logs

□ Support Ticket System

□ MQTT Device Management

□ InfluxDB Historical Data

□ AWS Deployment


User Management V2
    ↓
Account Control V1
    ↓
Company Management V1
    ↓
Audit Logs
    ↓
Support Tickets
    ↓
MQTT Device Management
    ↓
InfluxDB Historical Data
    ↓
AWS Deployment