CREATE TABLE "users" (
    "userId" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "mobile" VARCHAR(15),
    "userType" VARCHAR(20),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" VARCHAR(50),
    "updatedBy" VARCHAR(50),
    "deletedBy" VARCHAR(50),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ,
    "deletedAt" TIMESTAMPTZ
);