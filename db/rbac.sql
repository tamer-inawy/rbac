-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema rbac
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `rbac` ;

-- -----------------------------------------------------
-- Schema rbac
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `rbac` DEFAULT CHARACTER SET utf8 ;
USE `rbac` ;

-- -----------------------------------------------------
-- Table `rbac`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rbac`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rbac`.`group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rbac`.`group` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rbac`.`collection`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rbac`.`collection` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `grpid` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_collection_group1_idx` (`grpid` ASC) ,
  CONSTRAINT `fk_collection_group1`
    FOREIGN KEY (`grpid`)
    REFERENCES `rbac`.`group` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rbac`.`item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rbac`.`item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `parentid` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_item_collection1_idx` (`parentid` ASC) ,
  CONSTRAINT `fk_item_collection1`
    FOREIGN KEY (`parentid`)
    REFERENCES `rbac`.`collection` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rbac`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rbac`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role` ENUM('regular', 'manager', 'globalManager') NOT NULL COMMENT '\'regular\', \'manager\', \'globalManager\'',
  `groupid` INT NULL,
  `userid` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_role_group1_idx` (`groupid` ASC) ,
  INDEX `fk_role_user1_idx` (`userid` ASC) ,
  CONSTRAINT `fk_role_group1`
    FOREIGN KEY (`groupid`)
    REFERENCES `rbac`.`group` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_role_user1`
    FOREIGN KEY (`userid`)
    REFERENCES `rbac`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;




INSERT INTO `rbac`.`user` (`id`, `email`, `password`) VALUES (NULL, 'admin@test.com', '$2b$10$LWoIC8MoNAcs2j39x6K7gOETyEhpkWXOBMkk.z4hiAwleYCWadGj.');

INSERT INTO `rbac`.`role` (`id`, `role`, `groupid`, `userid`) VALUES (NULL, 'globalManager', NULL, '1');
