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

-- CreateIndex
CREATE UNIQUE INDEX "TokenSettings_token_address_key" ON "TokenSettings"("token_address");

-- CreateIndex
CREATE UNIQUE INDEX "TokenSettings_token_symbol_key" ON "TokenSettings"("token_symbol");

-- AddForeignKey
ALTER TABLE "TokenSettings" ADD CONSTRAINT "TokenSettings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
