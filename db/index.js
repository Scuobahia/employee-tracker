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
        .query('SELECT * FROM employees.first_name, employees.last_name, role.title, role.salary, department.department_name')
    }
}