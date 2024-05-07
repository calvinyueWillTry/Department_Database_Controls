DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;
USE company_db;

CREATE TABLE department_data (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   department VARCHAR(20) NOT NULL
);

CREATE TABLE role_data (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(20) NOT NULL, 
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department_data(id) ON DELETE SET NULL
);

CREATE TABLE employees_data (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL, 
    last_name VARCHAR(20) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role_data(id) ON DELETE SET NULL,
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employees_data(id) ON DELETE SET NULL
);




