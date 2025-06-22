-- CreateTable
CREATE TABLE "application_status" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "eligibility_completed" BOOLEAN NOT NULL DEFAULT false,
    "eligibility_completed_at" DATETIME,
    "package_purchased" BOOLEAN NOT NULL DEFAULT false,
    "package_purchased_at" DATETIME,
    "documents_uploaded" BOOLEAN NOT NULL DEFAULT false,
    "documents_uploaded_at" DATETIME,
    "application_reviewed" BOOLEAN NOT NULL DEFAULT false,
    "application_reviewed_at" DATETIME,
    "uscis_submitted" BOOLEAN NOT NULL DEFAULT false,
    "uscis_submitted_at" DATETIME,
    "current_step" TEXT NOT NULL DEFAULT 'eligibility',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "application_status_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "application_status_user_id_key" ON "application_status"("user_id");
