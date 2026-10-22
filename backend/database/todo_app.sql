-- Skema database untuk Todo App Backend (Tugas #4)
-- Import lewat phpMyAdmin / HeidiSQL (tab SQL) atau terminal:
--   mysql -u root < database/todo_app.sql

CREATE DATABASE IF NOT EXISTS todo_app_backend
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE todo_app_backend;

CREATE TABLE IF NOT EXISTS auth (
  id INT NOT NULL AUTO_INCREMENT,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS todos (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  task VARCHAR(255) NOT NULL,
  is_completed TINYINT(1) DEFAULT 0,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  CONSTRAINT todos_ibfk_1 FOREIGN KEY (user_id) REFERENCES auth (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
