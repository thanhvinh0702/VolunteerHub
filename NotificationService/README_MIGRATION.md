# Database Migration Instructions

## Problem

The `notification` table has a constraint `notification_type_check` that doesn't include all notification types, causing `EVENT_UPDATED` and potentially other types to fail when inserting.

## Solution

Run the SQL migration script to update the constraint.

### Option 1: Manual SQL Execution

Connect to your PostgreSQL database and run:

```bash
psql -h localhost -U your_username -d your_database -f src/main/resources/db/migration/fix_notification_constraint.sql
```

### Option 2: Using psql Command

```sql
-- Connect to your database
\c your_database_name

-- Drop old constraint
ALTER TABLE notification DROP CONSTRAINT IF EXISTS notification_type_check;

-- Add new constraint with all types
ALTER TABLE notification ADD CONSTRAINT notification_type_check
CHECK (type IN (
    'EVENT_REQUESTED',
    'EVENT_APPROVED',
    'EVENT_REJECTED',
    'EVENT_DELETED',
    'EVENT_UPDATED',
    'USER_EVENT_REQUESTED',
    'USER_EVENT_APPROVED',
    'USER_EVENT_REJECTED',
    'USER_EVENT_COMPLETED',
    'POST_CREATED',
    'POST_UPDATED',
    'REACTION',
    'COMMENT',
    'USER_ACTIVE',
    'USER_BANNED'
));
```

### Option 3: Using DBeaver or pgAdmin

1. Connect to your database
2. Open SQL Editor
3. Copy and paste the contents of `src/main/resources/db/migration/fix_notification_constraint.sql`
4. Execute the script

## Verification

After running the migration, verify the constraint:

```sql
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conname = 'notification_type_check';
```

## Important Notes

- This migration is safe to run multiple times (idempotent)
- No data will be lost
- The constraint will be updated to include all current notification types
- After this fix, the `EVENT_UPDATED` errors should disappear


