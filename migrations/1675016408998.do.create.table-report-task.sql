CREATE TABLE "reportTab" (
    "reportTabId" SERIAL PRIMARY KEY,
    "taskId" VARCHAR(255) NOT NULL,
    "statusFrom" VARCHAR(50),
    "statusTo" VARCHAR(50),
    "remarks" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" VARCHAR(50),
    "updatedBy" VARCHAR(50),
    "deletedBy" VARCHAR(50),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ,
    "deletedAt" TIMESTAMPTZ
);