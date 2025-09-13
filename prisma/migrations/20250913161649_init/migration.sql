-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "customerPayments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paymentId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "email" TEXT,
    "subscriptionType" TEXT NOT NULL DEFAULT 'FREE',
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "updatedAt" DATETIME,
    CONSTRAINT "customerPayments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "domains" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "addedById" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subdomain" TEXT,
    "verified" BOOLEAN DEFAULT true,
    "value" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "updatedAt" DATETIME,
    "healthScore" INTEGER DEFAULT 100,
    "lastChecked" DATETIME,
    "spamHouseStatus" TEXT DEFAULT 'UNKNOWN',
    "spfRecord" TEXT,
    "dkimRecord" TEXT,
    "dmarcRecord" TEXT,
    "mxRecords" TEXT,
    "isHealthy" BOOLEAN DEFAULT true,
    CONSTRAINT "domains_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "domains_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "inviter" TEXT NOT NULL,
    "invitedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "joinedAt" DATETIME,
    "deletedAt" DATETIME,
    "updatedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "teamRole" TEXT NOT NULL DEFAULT 'MEMBER',
    CONSTRAINT "members_email_fkey" FOREIGN KEY ("email") REFERENCES "users" ("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "members_inviter_fkey" FOREIGN KEY ("inviter") REFERENCES "users" ("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "members_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userCode" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "verificationTokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceCode" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "updatedAt" DATETIME,
    CONSTRAINT "workspaces_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "domainHealthChecks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domainId" TEXT NOT NULL,
    "checkType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "score" INTEGER,
    "details" TEXT,
    "checkedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "domainHealthChecks_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "domains" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "domainHealthReports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domainId" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "issues" TEXT,
    "recommendations" TEXT,
    "reportData" TEXT,
    "sentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "domainHealthReports_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "domains" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "spamHouseChecks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domainId" TEXT NOT NULL,
    "spamHouse" TEXT NOT NULL,
    "isListed" BOOLEAN NOT NULL,
    "reason" TEXT,
    "checkedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "spamHouseChecks_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "domains" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "customerPayments_paymentId_key" ON "customerPayments"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "customerPayments_customerId_key" ON "customerPayments"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "customerPayments_email_key" ON "customerPayments"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_workspaceId_email_key" ON "members"("workspaceId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_userCode_key" ON "users"("userCode");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_userCode_email_key" ON "users"("userCode", "email");

-- CreateIndex
CREATE UNIQUE INDEX "verificationTokens_token_key" ON "verificationTokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationTokens_identifier_token_key" ON "verificationTokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_workspaceCode_key" ON "workspaces"("workspaceCode");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_inviteCode_key" ON "workspaces"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_workspaceCode_inviteCode_key" ON "workspaces"("workspaceCode", "inviteCode");
