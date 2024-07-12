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

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsFrames" ADD CONSTRAINT "PostsFrames_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
