const cTable = require('console.table');
const mysql = require('mysql2');
const connection = require("./connection");
class DB {
    constructor(connection) {
        this.connection = connection;
    }
    findAll() {
        return this.connection
        .promise()
        .query('SELECT * FROM employees.first_name, employees.last_name, role.title, role.salary, department.name AS Department, CONCAT(manager.first_name, " ", manager.last_name) AS Manager FROM employees LEFT JOIN role on employees.role_id = role.id LEFT JOIN deparment on role.department.id = department.id LEFT JOIN employee manager on manager.id = employees.manager_id');
    }

}

    }
}