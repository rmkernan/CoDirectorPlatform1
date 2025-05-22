# Co-Director Database Schema
<!-- Last updated: May 15, 2023, 5:25 PM ET -->

This document outlines the database schema for the Co-Director application, which uses Supabase (PostgreSQL) for persistent storage.

## Naming Convention

The project uses camelCase for all table and column names. In PostgreSQL, this requires double quotes around identifiers to preserve case:

```sql
CREATE TABLE public."tableName" (
    "columnName" TYPE ...
);
```

### Important Note on Naming Convention Contrast

While the database uses camelCase for all identifiers, the Gemini API requires snake_case for all parameter names. This contrast requires careful handling in the n8n workflow:

1. **Database Interaction**: Use camelCase with double quotes for all database operations
   ```sql
   SELECT * FROM "codirectorChats" WHERE "sessionId" = 'value'
   ```

2. **Gemini API Interaction**: Use snake_case for all API parameters
   ```json
   {
     "generation_config": {
       "temperature": 0.7,
       "top_p": 0.95
     }
   }
   ```

For detailed information on Gemini API parameter naming requirements, see [CacheGuide.md](./Cache_n8n/CacheGuide.md#parameter-naming).

### SQL Query Considerations

When querying tables with camelCase column names, remember these important rules:

1. **Column Name Case Sensitivity**: Always use double quotes around column names to preserve case
   ```sql
   SELECT * FROM "codirectorChats" WHERE "sessionId" = 'value'
   ```

2. **String Values**: String values must be enclosed in single quotes
   ```sql
   WHERE "sessionId" = 'test-session-123'  -- Correct
   WHERE "sessionId" = test-session-123    -- Incorrect (treated as column name)
   ```

3. **Dynamic Values in n8n**: When using expressions in n8n Postgres node:
   ```sql
   WHERE "sessionId" = '{{ $json.sessionId }}'  -- Note the single quotes around the expression
   ```

4. **Ordering**: Order clauses work without quotes for column names, but using quotes is recommended for consistency
   ```sql
   ORDER BY "timestamp" DESC
   ```

## Tables

### sessions

Stores session-level metadata, configuration, and feedback.

```sql
CREATE TABLE public."sessions" (
    "sessionId" TEXT PRIMARY KEY,
    "geminiCacheId" TEXT,
    "cacheCreationTime" TIMESTAMPTZ,
    "cacheExpiryTime" TIMESTAMPTZ,
    "startTime" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "endTime" TIMESTAMPTZ,
    "principlesDocId" TEXT NOT NULL,
    "scenarioDocIds" TEXT[] NOT NULL,
    "sessionTopic" TEXT NOT NULL,
    "modelUsed" TEXT NOT NULL,
    "historyTurnsSetting" INTEGER NOT NULL,
    "totalTurns" INTEGER DEFAULT 0,
    "avgResponseLatency" FLOAT,
    "errorCount" INTEGER DEFAULT 0,
    "testerId" TEXT,
    "userNotes" TEXT,
    "rating" INTEGER,
    "tags" TEXT[],
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add index for faster queries by startTime (descending for newest first)
CREATE INDEX "sessions_startTime_idx" ON public."sessions"("startTime" DESC);

-- Create a trigger to automatically update the updatedAt column
CREATE TRIGGER "setUpdatedAt"
BEFORE UPDATE ON public."sessions"
FOR EACH ROW
EXECUTE FUNCTION public."handleUpdatedAt"();
```

### codirectorChats

Stores turn-by-turn messages between users and the AI.

```sql
CREATE TABLE public."codirectorChats" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "sessionId" TEXT NOT NULL REFERENCES public."sessions"("sessionId"),
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "role" TEXT NOT NULL CHECK ("role" IN ('user', 'ai', 'feedback')),
    "textContent" TEXT NOT NULL,
    "geminiCacheIdUsed" TEXT,
    "modelUsed" TEXT,
    "responseLatency" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add index for faster queries by sessionId
CREATE INDEX "codirectorChats_sessionId_idx" ON public."codirectorChats"("sessionId");

-- Add index for timestamp-based queries
CREATE INDEX "codirectorChats_timestamp_idx" ON public."codirectorChats"("timestamp");

-- Add RLS policies if needed
ALTER TABLE public."codirectorChats" ENABLE ROW LEVEL SECURITY;

-- Create a trigger to automatically update the updatedAt column
CREATE OR REPLACE FUNCTION public."handleUpdatedAt"()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "setUpdatedAt"
BEFORE UPDATE ON public."codirectorChats"
FOR EACH ROW
EXECUTE FUNCTION public."handleUpdatedAt"();
```

### handbookEmbeddings

Stores vectorized chunks of the employee handbook for RAG.

```sql
CREATE TABLE public."handbookEmbeddings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "embedding" VECTOR(1536) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create vector index for similarity search
CREATE INDEX "handbookEmbeddings_embedding_idx" ON public."handbookEmbeddings" USING ivfflat ("embedding" vector_cosine_ops);
```

## Column Descriptions

### sessions Table

| Column | Type | Description |
|--------|------|-------------|
| sessionId | TEXT | Primary key, unique identifier for the session |
| geminiCacheId | TEXT | ID of the Gemini context cache |
| cacheCreationTime | TIMESTAMPTZ | When the cache was created |
| cacheExpiryTime | TIMESTAMPTZ | When the cache will expire |
| startTime | TIMESTAMPTZ | When the session started |
| endTime | TIMESTAMPTZ | When the session ended (null if active) |
| principlesDocId | TEXT | Google Doc ID for principles document |
| scenarioDocIds | TEXT[] | Array of Google Doc IDs for scenario documents |
| sessionTopic | TEXT | Topic/title of the session |
| modelUsed | TEXT | Gemini model used (e.g., "gemini-2.0-flash") |
| historyTurnsSetting | INTEGER | Number of conversation turns to include in context |
| totalTurns | INTEGER | Total number of turns in the conversation |
| avgResponseLatency | FLOAT | Average response time in milliseconds |
| errorCount | INTEGER | Number of errors encountered during the session |
| testerId | TEXT | ID of the tester who created the session |
| userNotes | TEXT | Feedback notes from the tester |
| rating | INTEGER | Numerical rating (typically 1-5) |
| tags | TEXT[] | Array of tags for categorization |
| createdAt | TIMESTAMPTZ | System timestamp when record was created |
| updatedAt | TIMESTAMPTZ | System timestamp when record was last updated |

### codirectorChats Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, unique identifier for the message |
| sessionId | TEXT | Foreign key to sessions table |
| timestamp | TIMESTAMPTZ | When the message was sent/received |
| role | TEXT | Who sent the message ('user', 'ai', or 'feedback') |
| textContent | TEXT | The actual message content |
| geminiCacheIdUsed | TEXT | Cache ID used for this message (for AI responses) |
| modelUsed | TEXT | Model used for this message (for AI responses) |
| responseLatency | INTEGER | Response time in milliseconds (for AI responses) |
| createdAt | TIMESTAMPTZ | System timestamp when record was created |
| updatedAt | TIMESTAMPTZ | System timestamp when record was last updated |

## Purpose of createdAt and updatedAt

These system timestamps serve several important purposes:

1. **Audit Trail**: Track when records were created and modified
2. **System Maintenance**: Identify records for archiving or cleanup
3. **Debugging**: Diagnose timing issues between application and database
4. **Analytics**: Measure system usage patterns
5. **Data Integrity**: Provide system-level timestamps independent of business logic

## Indexes

Indexes are created on frequently queried columns to improve performance:

1. **sessions.startTime**: For sorting sessions by start time
2. **codirectorChats.sessionId**: For retrieving all messages in a session
3. **codirectorChats.timestamp**: For sorting messages chronologically
4. **handbookEmbeddings.embedding**: For vector similarity search (RAG)
