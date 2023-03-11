CREATE TYPE "priorityEnum" AS ENUM ('low', 'mid', 'high', 'extreme');

CREATE TYPE "statusEnum" AS ENUM ('pending', 'done', 'in-progress', 'postpone', 'buried');

CREATE TABLE tasks (
    "taskId" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "remarks" TEXT,
    "scheduleDate" VARCHAR(20),
    "priority" "priorityEnum" DEFAULT 'low',
    "currentStatus" "statusEnum" DEFAULT 'pending',
    "assignTo" VARCHAR(50),
    "assignBy" VARCHAR(50),
    "status" BOOLEAN DEFAULT true,
    "createdBy" VARCHAR(50),
    "updatedBy" VARCHAR(50),
    "deletedBy" VARCHAR(50),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ,
    "deletedAt" TIMESTAMPTZ
);