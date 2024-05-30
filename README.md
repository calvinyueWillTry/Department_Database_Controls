Summary of how it works:
See the video of the walkthrough.
schema.sql: it CREATE DATABASE then USE company_db; which is the db being used in this case.
The following tables are created (note that id INT NOT NULL AUTO_INCREMENT PRIMARY KEY is established at the top of every table, VARCHAR(20) NOT NULL means 20 characters max, and FOREIGN KEY (name_id) REFERENCES table_name(id) ON DELETE SET NULL means to set that as a Foreign Key in that particular table from another table): Department (id and name of department VARCHAR(20) NOT NULL), Employee roles (id, job_title VARCHAR(20) NOT NULL, salary DECIMAL NOT NULL (if decimals were used), department_id INT FOREIGN KEY (department_id) REFERENCES department_data(id) ON DELETE SET NULL), and employees (id, first_name, last_name, role_id INT (instead of name, reference id for their role), FOREIGN KEY (role_id) REFERENCES role_data(id) ON DELETE SET NULL, manager_id INT, FOREIGN KEY (manager_id) REFERENCES employees_data(id) ON DELETE SET NULL).
For seeds.sql, the department_data table (name of column is (department)) is filled with ("strings for name of departments, automatically given an id"), the role_data table (name of columns (automatic id being its own column) are (job_title, salary, department_id), note the last one is a foreignKey), and the employees_data table (automatic id being its own column) have columns (first_name, last_name, role_id), last one being a foreignKey, and 2 managers assigned (UPDATE employees_data SET manager_id = 1 WHERE id IN (3, 4); UPDATE employees_data SET manager_id = 2 WHERE id IN (2, 5);).
On server.js, 'express', "mysql2", 'inquirer', and express() are imported. urlencoded({ extended: false }) and express.json() are incorporated as middleware. 
The .env and SQL clearance are incorporated in the variable "db".
mainMenu() is the first function called. This pulls up a prompt to select a string from a list of choices, which, when highlighted and entered, response.viewMainMenu === "selected string", will prompt the function within that.
At the end of this list array, it brings up another prompt, transfer that info to the function updateEmployee through (res.id, res.roleid). 
For the view functions (viewEmployees(), viewRoles() and viewDepartments()), the db.query("includes a SQL command that can be written in JS instead of SQL"), then console.table(res); return mainMenu(); note that the "res" will result in that specific table from seed.sql. 
For the add functions (addNewDepartment(), addNewRole() and addEmployee()), it first prompts the question, .then(variable containing that selection) => { let variableName = (variable containing that selection).name(which is the title of the input); make another variable = "INSERT INTO table_name SET ?", then db.query (variable that contain SQL command, {tableName: variableName that contains the selection data});} then produce the corresponding view function in order to view the updated table.
For the updateEmployee (parameters including id, roleid) => {db.query(SQL command "UPDATE employees_data SET role_id = ? WHERE id = ?", [roleid, id from the parameters above], (Err)...); after replacing the numerical id for that selected employee for both their role_id and department_id, goes to the employee table to see updated data.

}
# 12 SQL: Employee Tracker

## Your Task

Developers frequently have to create interfaces that allow non-developers to easily view and interact with information stored in databases. These interfaces are called **content management systems (CMS)**. Your assignment this week is to build a command-line application from scratch to manage a company's employee database, using Node.js, Inquirer, and MySQL.

Because this Challenge will require the use of the `Inquirer` package, ensure that you install and use Inquirer version 8.2.4. To do so, use the following command in your project folder: `npm i inquirer@8.2.4`.

Because this application won’t be deployed, you’ll also need to create a walkthrough video that demonstrates its functionality and all of the following acceptance criteria being met. You’ll need to submit a link to the video and add it to the README of your project.

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Mock-Up

The following video shows an example of the application being used from the command line:

[![A video thumbnail shows the command-line employee management application with a play button overlaying the view.](./Assets/12-sql-homework-video-thumbnail.png)](https://2u-20.wistia.com/medias/2lnle7xnpk)

## Getting Started

This Challenge will require a video submission. Refer to the [Fullstack Blog Video Submission Guide](https://coding-boot-camp.github.io/full-stack/computer-literacy/video-submission-guide) for additional guidance on creating a video.

You’ll need to use the [MySQL2 package](https://www.npmjs.com/package/mysql2) to connect to your MySQL database and perform queries, and the [Inquirer package](https://www.npmjs.com/package/inquirer/v/8.2.4) to interact with the user via the command line.

**Important**: You will be committing a file that contains your database credentials. Make sure that your MySQL password is not used for any other personal accounts, because it will be visible on GitHub. In upcoming lessons, you will learn how to better secure this password, or you can start researching npm packages now that could help you.

You might also want to make your queries asynchronous. MySQL2 exposes a `.promise()` function on Connections to upgrade an existing non-Promise connection to use Promises. To learn more and make your queries asynchronous, refer to the [npm documentation on MySQL2](https://www.npmjs.com/package/mysql2).

Design the database schema as shown in the following image:

![Database schema includes tables labeled “employee,” role,” and “department.”](./Assets/12-sql-homework-demo-01.png)

As the image illustrates, your schema should contain the following three tables:

* `department`

    * `id`: `INT PRIMARY KEY`

    * `name`: `VARCHAR(30)` to hold department name

* `role`

    * `id`: `INT PRIMARY KEY`

    * `title`: `VARCHAR(30)` to hold role title

    * `salary`: `DECIMAL` to hold role salary

    * `department_id`: `INT` to hold reference to department role belongs to

* `employee`

    * `id`: `INT PRIMARY KEY`

    * `first_name`: `VARCHAR(30)` to hold employee first name

    * `last_name`: `VARCHAR(30)` to hold employee last name

    * `role_id`: `INT` to hold reference to employee role

    * `manager_id`: `INT` to hold reference to another employee that is the manager of the current employee (`null` if the employee has no manager)

You might want to use a separate file that contains functions for performing specific SQL queries you'll need to use. A constructor function or class could be helpful for organizing these. You might also want to include a `seeds.sql` file to pre-populate your database, making the development of individual features much easier.

## Bonus

Try to add some additional functionality to your application, such as the ability to do the following:

* Update employee managers.

* View employees by manager.

* View employees by department.

* Delete departments, roles, and employees.

* View the total utilized budget of a department&mdash;in other words, the combined salaries of all employees in that department.

## Grading Requirements

> **Note**: If a Challenge assignment submission is marked as “0”, it is considered incomplete and will not count towards your graduation requirements. Examples of incomplete submissions include the following:
>
> * A repository that has no code
>
> * A repository that includes a unique name but nothing else
>
> * A repository that includes only a README file but nothing else
>
> * A repository that only includes starter code

This Challenge is graded based on the following criteria:

### Deliverables: 10%

* Your GitHub repository containing your application code.

### Walkthrough Video: 27%

* A walkthrough video that demonstrates the functionality of the employee tracker must be submitted, and a link to the video should be included in your README file.

* The walkthrough video must show all of the technical acceptance criteria being met.

* The walkthrough video must demonstrate how a user would invoke the application from the command line.

* The walkthrough video must demonstrate a functional menu with the options outlined in the acceptance criteria.

### Technical Acceptance Criteria: 40%

* Satisfies all of the preceding acceptance criteria plus the following:

    * Uses the [Inquirer package](https://www.npmjs.com/package/inquirer/v/8.2.4).

    * Uses the [MySQL2 package](https://www.npmjs.com/package/mysql2) to connect to a MySQL database.

* Follows the table schema outlined in the Challenge instructions.

### Repository Quality: 13%

* Repository has a unique name.

* Repository follows best practices for file structure and naming conventions.

* Repository follows best practices for class/id naming conventions, indentation, quality comments, etc.

* Repository contains multiple descriptive commit messages.

* Repository contains a high-quality README with description and a link to a walkthrough video.

### Application Quality 10%

* The application user experience is intuitive and easy to navigate.

### Bonus

Fulfilling any of the following can add up to 20 points to your grade. Note that the highest grade you can achieve is still 100:

* Application allows users to update employee managers (2 points).

* Application allows users to view employees by manager (2 points).

* Application allows users to view employees by department (2 points).

* Application allows users to delete departments, roles, and employees (2 points for each).

* Application allows users to view the total utilized budget of a department&mdash;in other words, the combined salaries of all employees in that department (8 points).

## Review

You are required to submit BOTH of the following for review:

* A walkthrough video demonstrating the functionality of the application.

* The URL of the GitHub repository, with a unique name and a README describing the project.

- - -
© 2024 edX Boot Camps LLC. Confidential and Proprietary. All Rights Reserved.
