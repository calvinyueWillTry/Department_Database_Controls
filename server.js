const express = require('express');
// Import and require mysql2
const mysql = require("mysql2");
const inquirer = require('inquirer');//from index.d.ts: import { Interface as ReadlineInterface } from "readline";
const PORT = process.env.PORT || 3011;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const readline = require('readline');

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL Username
        user: 'root',
        password: 'YueinGod3?',
        //create database
        database: 'company_db'
    },
);
function mainMenu() {
    inquirer.prompt([{
        type: "list",
        message: "what would you like to do?",
        choices: ["view all employees", "view all roles", "view all departments", "add a department", "add a role", "add an employee", "update an employee role"],//last one has no else if
        name: "viewMainMenu"
        // . method function that goes into an object (function that creates an arguments). .then finishes the function inside before moving on.
    }]).then((response) => {
        if (response.viewMainMenu === "view all employees") {
            viewEmployees()
            
        } else if (response.viewMainMenu === "view all roles") {
            viewRoles()

        } else if (response.viewMainMenu === "view all departments") {
            viewDepartments();

        } else if (response.viewMainMenu === "add a department") {
            addNewDepartment();
            
        } else if (response.viewMainMenu === "add a role") {
            addNewRole();
        } else if (response.viewMainMenu === "add an employee") {
         addEmployee()
        } else { 
            inquirer.prompt([
                {
                    type:"input",
                    message:"input the emplyess id",
                    name:"id"
                },
                {
                    type: "input",
                    message: "what is their new role ID?",
                    name: "roleid"
                }
            ]).then((res)=>updateEmployee(res.id, res.roleid))
        }

    }
    )
}
mainMenu();
function viewEmployees() {
    db.query("SELECT * FROM employees_data", (err, res) => {
        
        if (err) { res.status(400).json({ error: err.message }) }
        else { //get to the table
            console.table(res);
            return mainMenu();
        }
    })
}
function viewRoles() {
    db.query("SELECT * FROM role_data", (error, response) => {
        if (error) { res.status(400).json({ err: error.message }) }
        else {
            console.table(response);
            return mainMenu();
        }
    })
}
function viewDepartments() {
    db.query("SELECT * FROM department_data", (err, resp) => {
        if (err) { resp.status(400).json({ error: err.message }) }
        else {
            console.table(resp);
            return mainMenu();
        }
    })
}
function addNewDepartment() {
    const questions = [
        {
            type: 'input',
            name: 'name',
            message: "please enter the new department",
        },
    ];
    inquirer.prompt(questions).then(answers => {
        console.log(`Hi ${answers.name}!`);
        let newDepartment = answers.name;
        console.log(newDepartment);
        const departmentDataSet = "INSERT INTO department_data SET ?";//? is data input replaced with object
        db.query(departmentDataSet, {department: newDepartment}, async (err, newDepartment) => {
            if (err) { err.message }
            else {
                viewDepartments();
            }
        })
    }
    );
}
function addNewRole() {
    db.query("SELECT id AS value, department AS name FROM department_data", (err, data) => {
      console.log(data)  
    
    const question = [
        {
            type: 'input',
            name: 'title',
            message: "please add a new job title",
        },
        {
            type: 'input',
            name: 'salary',
            message: "please add the salary",
        },
        {
            type: 'list',
            name: 'department_id',
            message: "Choose from the following departments:",
            choices: data
        }

    ];
    inquirer.prompt(question).then(answer => {
        let newRole = answer.title;
        console.log(newRole);
        let newSalary = answer.salary;
        console.log(newSalary);
        let newDepartmentid = answer.department_id;
        console.log(newDepartmentid)
        const roleDataSet = "INSERT INTO role_data SET ?";
        db.query(roleDataSet, {job_title: newRole, salary: newSalary, department_id: newDepartmentid}, (err) => {
            if (err) { err.message }
            else {
                viewRoles();
            }
        })
    }) 
}); //from line 124
} 
function addEmployee() {
    db.query("SELECT id AS value, CONCAT(first_name, ' ' , last_name) AS name FROM employees_data", (err, employeesData) => { //how to add "WHERE id = 1 AND WHERE id = 2" 
    db.query("SELECT id AS value, job_title AS name FROM role_data", (err, roleData) => {
        inquirer.prompt([{
            type: "input",
            name: "firstName",
            message: "please enter the new employee's first name",
            },
            {
            type: "input",
            name: "lastName",
            message: "please enter the new employee's last name",
            },
            {
            type: "list",
            name: "roleID",
            message: "what is the new employee's job title?",
            choices: roleData,
            },
            {
            type: "list", 
            name: "managerID",
            message: "who is the new employee's manager?",
            choices: employeesData, //need to apply to null, not other employees included
            },
    ]).then((entry) => {
        console.log(entry.name);
        const employeeDataSet = "INSERT INTO employees_data SET ?";
                                //{table column: object passed in.prompt name}
        db.query(employeeDataSet, {first_name: entry.firstName, last_name:entry.lastName, role_id: entry.roleID, manager_id: entry.managerID}, (err) => {
            if (err) { err.message }
            else {
                viewEmployees();
            }
        })
    })
    })
    })
};
function updateEmployee(id, roleid) {

    console.log(id, roleid)//doesn't need "SELECT id AS value...""
    db.query("UPDATE employees_data SET role_id = ? WHERE id = ?", [roleid, id], ((err) => {
        if (err) { err.message }
        else {
            viewEmployees()
        }
    }))
};
