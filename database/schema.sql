-- ============================================================
-- Student Skill Gap Analysis and Personalized Career Roadmap
-- Database Schema (MySQL 8+)
-- ============================================================

CREATE DATABASE IF NOT EXISTS skill_gap_system;
USE skill_gap_system;

-- ------------------------------------------------------------
-- 1. users
-- Stores login credentials for both students and admins.
-- ------------------------------------------------------------
CREATE TABLE users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100)        NOT NULL,
    email           VARCHAR(150)        NOT NULL UNIQUE,
    password_hash   VARCHAR(255)        NOT NULL,
    role            ENUM('STUDENT', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    created_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. student_profiles
-- Extra profile info for STUDENT users (1-to-1 with users).
-- ------------------------------------------------------------
CREATE TABLE student_profiles (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    user_id             INT NOT NULL UNIQUE,
    college_name        VARCHAR(150),
    branch              VARCHAR(100),
    semester             INT,
    selected_career_id  INT NULL,
    bio                 VARCHAR(500),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    -- selected_career_id references career_roles(id); FK added after that table is created
);

-- ------------------------------------------------------------
-- 3. skills
-- Master list of all skills known to the system.
-- ------------------------------------------------------------
CREATE TABLE skills (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    category    VARCHAR(100),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 4. career_roles
-- Career roles a student can target (Java Developer, etc.)
-- ------------------------------------------------------------
CREATE TABLE career_roles (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(120) NOT NULL UNIQUE,
    description VARCHAR(500),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Now that career_roles exists, add the FK from student_profiles
ALTER TABLE student_profiles
    ADD CONSTRAINT fk_profile_career
    FOREIGN KEY (selected_career_id) REFERENCES career_roles(id) ON DELETE SET NULL;

-- ------------------------------------------------------------
-- 5. career_required_skills
-- Which skills are required for which career role (many-to-many).
-- ------------------------------------------------------------
CREATE TABLE career_required_skills (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    career_id   INT NOT NULL,
    skill_id    INT NOT NULL,
    priority    ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    CONSTRAINT fk_crs_career FOREIGN KEY (career_id) REFERENCES career_roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_crs_skill  FOREIGN KEY (skill_id)  REFERENCES skills(id)       ON DELETE CASCADE,
    CONSTRAINT uq_career_skill UNIQUE (career_id, skill_id)
);

-- ------------------------------------------------------------
-- 6. student_skills
-- Skills a student has, and their proficiency level.
-- ------------------------------------------------------------
CREATE TABLE student_skills (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    skill_id    INT NOT NULL,
    status      ENUM('AVAILABLE', 'PARTIALLY_KNOWN', 'MISSING') NOT NULL DEFAULT 'AVAILABLE',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ss_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
    CONSTRAINT fk_ss_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_skill UNIQUE (user_id, skill_id)
);

-- ------------------------------------------------------------
-- 7. learning_resources
-- Resources (links/books/courses) attached to a skill.
-- ------------------------------------------------------------
CREATE TABLE learning_resources (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    skill_id    INT NOT NULL,
    title       VARCHAR(200) NOT NULL,
    url         VARCHAR(500),
    type        ENUM('ARTICLE', 'VIDEO', 'COURSE', 'DOCS', 'BOOK', 'OTHER') NOT NULL DEFAULT 'OTHER',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resource_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 8. roadmaps
-- One roadmap per student per career (generated after skill-gap).
-- ------------------------------------------------------------
CREATE TABLE roadmaps (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    career_id   INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_roadmap_user   FOREIGN KEY (user_id)   REFERENCES users(id)        ON DELETE CASCADE,
    CONSTRAINT fk_roadmap_career FOREIGN KEY (career_id) REFERENCES career_roles(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_career_roadmap UNIQUE (user_id, career_id)
);

-- ------------------------------------------------------------
-- 9. roadmap_items
-- Individual steps inside a roadmap (one per missing/weak skill).
-- ------------------------------------------------------------
CREATE TABLE roadmap_items (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    roadmap_id      INT NOT NULL,
    skill_id        INT NOT NULL,
    description     VARCHAR(500),
    priority        ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    resource_id     INT NULL,
    status          ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
    step_order      INT NOT NULL DEFAULT 1,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ri_roadmap  FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id)          ON DELETE CASCADE,
    CONSTRAINT fk_ri_skill    FOREIGN KEY (skill_id)   REFERENCES skills(id)            ON DELETE CASCADE,
    CONSTRAINT fk_ri_resource FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- 10. progress
-- Progress percentage tracking for each roadmap item.
-- ------------------------------------------------------------
CREATE TABLE progress (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    roadmap_item_id  INT NOT NULL UNIQUE,
    percentage       INT NOT NULL DEFAULT 0 CHECK (percentage BETWEEN 0 AND 100),
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_progress_item FOREIGN KEY (roadmap_item_id) REFERENCES roadmap_items(id) ON DELETE CASCADE
);
