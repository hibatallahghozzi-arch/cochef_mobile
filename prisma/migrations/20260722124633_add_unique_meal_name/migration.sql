/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `meals` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "meals_name_key" ON "meals"("name");
