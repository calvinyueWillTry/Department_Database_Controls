USE company_db;

INSERT INTO department_data (department)
VALUES 
("management"), ("marketing"), ("technician"), ("front desk"), ("cleaning");

INSERT INTO role_data (job_title, salary, department_id)
VALUES
("office manager", "250000", 1),
("janitor", "50000", 5),
("receptionist", "60000", 4),
("representative", "500000", 2),
("computer technician", "100000", 3),
("front desk manager", "150000", 1);

INSERT INTO employees_data (first_name, last_name, role_id)
VALUES 
("Dale", "Wales", 1),
("Ernie", "Weigel", 6),
("Fern", "Yuk", 3),
("George", "Clooney", 4),
("Harry", "Bay", 5),
("Isaac", "Soar", 2);
UPDATE employees_data SET manager_id = 1 WHERE id IN (3, 4);
UPDATE employees_data SET manager_id = 2 WHERE id IN (2, 5);


