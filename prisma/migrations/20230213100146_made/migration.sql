/*
  Warnings:

  - Made the column `comment` on table `photo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `photo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `photo` DROP FOREIGN KEY `Photo_user_id_fkey`;

-- AlterTable
ALTER TABLE `photo` MODIFY `comment` VARCHAR(191) NOT NULL,
    MODIFY `user_id` INTEGER UNSIGNED NOT NULL;

-- AddForeignKey
ALTER TABLE `Photo` ADD CONSTRAINT `Photo_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
