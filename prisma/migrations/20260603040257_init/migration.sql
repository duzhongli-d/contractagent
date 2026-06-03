-- CreateTable
CREATE TABLE "user_queries" (
    "clerk_user_id" TEXT NOT NULL,
    "document_quota_left" INTEGER NOT NULL DEFAULT 2,
    "documents_analysed" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_queries_pkey" PRIMARY KEY ("clerk_user_id")
);
