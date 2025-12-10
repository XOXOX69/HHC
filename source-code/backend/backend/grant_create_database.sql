-- SQL script to grant CREATE DATABASE privilege to the application user
-- Run this script as a MySQL admin user (like 'root')

-- Replace 'ADMIN' with your actual database username if different
-- Replace '%' with 'localhost' if you're connecting locally only

-- Grant CREATE privilege for creating new databases
GRANT CREATE ON *.* TO 'ADMIN'@'%';

-- Grant full privileges on any database that starts with 'pos_branch_'
-- This allows the user to manage branch databases
GRANT ALL PRIVILEGES ON `pos_branch_%`.* TO 'ADMIN'@'%';

-- Reload the privileges
FLUSH PRIVILEGES;

-- Verify the grants
SHOW GRANTS FOR 'ADMIN'@'%';
