DELETE FROM `letbknown`.`smprofiles` WHERE (`sm_profile_id` = '5');
DELETE FROM `letbknown`.`smprofiles` WHERE (`sm_profile_id` = '6');
DELETE FROM `letbknown`.`smprofiles` WHERE (`sm_profile_id` = '7');

ALTER TABLE `letbknown`.`smprofiles` 
ADD COLUMN `page_account_name` VARCHAR(100) NULL AFTER `page_id`;

DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '2');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '3');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '4');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '5');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '6');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '9');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '10');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '11');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '12');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '13');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '14');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '15');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '16');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '17');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '18');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '19');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '20');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '21');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '22');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '23');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '24');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '25');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '26');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '27');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '29');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '30');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '51');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '53');
DELETE FROM `letbknown`.`postcontent` WHERE (`id` = '54');


DELETE FROM `letbknown`.`users` WHERE (`user_id` = '4');
DELETE FROM `letbknown`.`users` WHERE (`user_id` = '5');
DELETE FROM `letbknown`.`users` WHERE (`user_id` = '7');