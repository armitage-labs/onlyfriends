-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "display_name" TEXT,
    "provider_id" TEXT NOT NULL,
    "profile_pic" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_preview_image" TEXT,
    "text" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostsFrames" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "post_image" TEXT NOT NULL,

    CONSTRAINT "PostsFrames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenSettings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "chain_id" TEXT NOT NULL,
    "token_name" TEXT NOT NULL,
    "token_address" TEXT NOT NULL,
    "token_symbol" TEXT NOT NULL,

    CONSTRAINT "TokenSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoices" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "walet_address" TEXT NOT NULL,
    "txId" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_provider_id_key" ON "Users"("provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "TokenSettings_token_address_key" ON "TokenSettings"("token_address");

-- CreateIndex
CREATE UNIQUE INDEX "TokenSettings_token_symbol_key" ON "TokenSettings"("token_symbol");

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsFrames" ADD CONSTRAINT "PostsFrames_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenSettings" ADD CONSTRAINT "TokenSettings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
