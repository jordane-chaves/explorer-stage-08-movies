-- CreateTable
CREATE TABLE "movies" (
    "id" TEXT NOT NULL,
    "spectator_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "rating" INTEGER,
    "watched_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_spectator_id_fkey" FOREIGN KEY ("spectator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
