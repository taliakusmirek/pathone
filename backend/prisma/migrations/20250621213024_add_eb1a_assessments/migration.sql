-- CreateTable
CREATE TABLE "eb1a_assessments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "country_of_origin" TEXT NOT NULL,
    "achievements" TEXT NOT NULL,
    "is_eligible" BOOLEAN NOT NULL,
    "criteriaMet" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
