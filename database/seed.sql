-- ============================================================
-- Seed data: career roles, skills, required-skill mappings,
-- and sample learning resources.
-- Run this AFTER schema.sql.
-- ============================================================

USE skill_gap_system;

-- ------------------------------------------------------------
-- Career roles
-- ------------------------------------------------------------
INSERT INTO career_roles (title, description) VALUES
('Java Developer',      'Builds backend applications and services using Java and related frameworks.'),
('Frontend Developer',  'Builds user interfaces and client-side experiences for web applications.'),
('Backend Developer',   'Builds server-side logic, APIs, and database-driven services.'),
('Software Developer',  'General-purpose software engineering role covering full-stack development.'),
('Data Analyst',        'Analyzes data to find trends and support business decisions.');

-- ------------------------------------------------------------
-- Skills (master list)
-- ------------------------------------------------------------
INSERT INTO skills (name, category) VALUES
('Java', 'Programming Language'),
('OOP', 'Fundamentals'),
('SQL', 'Database'),
('Git', 'Tools'),
('Spring Boot', 'Framework'),
('REST API', 'Concept'),
('DSA', 'Fundamentals'),
('HTML', 'Frontend'),
('CSS', 'Frontend'),
('JavaScript', 'Programming Language'),
('React', 'Frontend Framework'),
('React Router', 'Frontend Framework'),
('Node.js', 'Backend Runtime'),
('Express.js', 'Backend Framework'),
('MySQL', 'Database'),
('MongoDB', 'Database'),
('System Design', 'Fundamentals'),
('Python', 'Programming Language'),
('Pandas', 'Data Analysis'),
('Excel', 'Data Analysis'),
('Power BI', 'Data Visualization'),
('Statistics', 'Fundamentals'),
('Communication', 'Soft Skill'),
('Problem Solving', 'Soft Skill');

-- ------------------------------------------------------------
-- Helper note: skill ids above follow insertion order (1-24)
-- 1 Java, 2 OOP, 3 SQL, 4 Git, 5 Spring Boot, 6 REST API, 7 DSA,
-- 8 HTML, 9 CSS, 10 JavaScript, 11 React, 12 React Router,
-- 13 Node.js, 14 Express.js, 15 MySQL, 16 MongoDB,
-- 17 System Design, 18 Python, 19 Pandas, 20 Excel,
-- 21 Power BI, 22 Statistics, 23 Communication, 24 Problem Solving
-- ------------------------------------------------------------

-- Java Developer (career_id = 1) required skills
INSERT INTO career_required_skills (career_id, skill_id, priority) VALUES
(1, 1, 'HIGH'),   -- Java
(1, 2, 'HIGH'),   -- OOP
(1, 3, 'MEDIUM'), -- SQL
(1, 4, 'MEDIUM'), -- Git
(1, 5, 'HIGH'),   -- Spring Boot
(1, 6, 'HIGH'),   -- REST API
(1, 7, 'HIGH');   -- DSA

-- Frontend Developer (career_id = 2) required skills
INSERT INTO career_required_skills (career_id, skill_id, priority) VALUES
(2, 8,  'HIGH'),   -- HTML
(2, 9,  'HIGH'),   -- CSS
(2, 10, 'HIGH'),   -- JavaScript
(2, 11, 'HIGH'),   -- React
(2, 12, 'MEDIUM'), -- React Router
(2, 4,  'MEDIUM'); -- Git

-- Backend Developer (career_id = 3) required skills
INSERT INTO career_required_skills (career_id, skill_id, priority) VALUES
(3, 13, 'HIGH'),   -- Node.js
(3, 14, 'HIGH'),   -- Express.js
(3, 15, 'HIGH'),   -- MySQL
(3, 6,  'HIGH'),   -- REST API
(3, 4,  'MEDIUM'), -- Git
(3, 17, 'MEDIUM'); -- System Design

-- Software Developer (career_id = 4) required skills
INSERT INTO career_required_skills (career_id, skill_id, priority) VALUES
(4, 7,  'HIGH'),   -- DSA
(4, 2,  'HIGH'),   -- OOP
(4, 10, 'MEDIUM'), -- JavaScript
(4, 1,  'MEDIUM'), -- Java
(4, 4,  'MEDIUM'), -- Git
(4, 17, 'MEDIUM'); -- System Design

-- Data Analyst (career_id = 5) required skills
INSERT INTO career_required_skills (career_id, skill_id, priority) VALUES
(5, 18, 'HIGH'),   -- Python
(5, 19, 'HIGH'),   -- Pandas
(5, 3,  'HIGH'),   -- SQL
(5, 20, 'MEDIUM'), -- Excel
(5, 21, 'MEDIUM'), -- Power BI
(5, 22, 'MEDIUM'); -- Statistics

-- ------------------------------------------------------------
-- Sample learning resources
-- ------------------------------------------------------------
INSERT INTO learning_resources (skill_id, title, url, type) VALUES
(5,  'Spring Boot Official Guide',        'https://spring.io/guides/gs/spring-boot/',          'DOCS'),
(6,  'REST API Tutorial',                 'https://restfulapi.net/',                            'ARTICLE'),
(7,  'DSA Roadmap (freeCodeCamp)',        'https://www.freecodecamp.org/news/tag/data-structures/', 'COURSE'),
(11, 'React Official Docs',               'https://react.dev/learn',                            'DOCS'),
(13, 'Node.js Official Docs',             'https://nodejs.org/en/docs',                         'DOCS'),
(15, 'MySQL Tutorial',                    'https://dev.mysql.com/doc/mysql-tutorial-excerpt/8.0/en/', 'DOCS'),
(18, 'Python for Everybody',              'https://www.py4e.com/',                              'COURSE'),
(21, 'Power BI Learning Path',            'https://learn.microsoft.com/power-bi/',              'DOCS');
