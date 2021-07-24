const inquirer = require('inquirer');
const db = require('./db/connection');
const mysql = require('mysql2');
var consoleTable = require('console.table')



const start = () => {
  inquirer.prompt( {
    name: 'action',
    type: 'list',
    message: 'What would you like to do today?',
    choices: [
      'View All Employees',
      'View All Departments',
      'View All Roles',
      'Update an Employee Role',
      'Add New Employee',
      'Remove An Employee',
      'Exit'
    ],
  })
  .then((res) => {
    switch (res.action) {
      case 'View All Employees':
          viewEmployees();
          break;
      case 'View All Departments':
          viewDepartment();
          break;    
      case 'View All Roles':
          viewRoles();
          break;
      case 'Update an Employee Role':
          updateEmployee();
          break;   
      case 'Add New Employee':
          addEmployee();
          break;
      case 'Remove An Employee':
          removeEmployee();
          break;
      case 'Exit':
        console.log('Have a nice day!')  
        Connection.end();
          break;   

      // default:
      //   console.log('Invalid action: ${answer.action}');
      //     break;

    }
  });
};

//view department
function viewDepartment(){
  db.query(`SELECT * FROM  department`,(err,res) => {
    if (err) throw err;
      console.table(res);
      start();
    });
  
};


//view employee
function viewEmployees(){
    db.query("SELECT employees.id, employees.first_name, employees.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM department INNER JOIN role ON department.id = role.department_id INNER JOIN employees ON role.id = employees.role_id LEFT JOIN employees manager ON employees.manager_id = manager.id ORDER BY employees.id ASC", 
    (err,res) => {
      console.log(res)
      if(err) throw err;
        console.table(res);
        start();
      });
    
};

//view roles
function viewRoles(){
  db.query(`SELECT role.id, title, name, salary FROM role INNER JOIN department ON role.department_id = department.id ORDER BY id ASC`, function(err,res){
    if (err) throw err;
    console.table(res)
    start();
  })
}

//update employee
function updateEmployee(){
  db.query("SELECT * FROM employees", function (err,responseEmp) {
    if (err) throw err;
    db.query("SELECT * FROM role", function(err,responseRole){
      if (err) throw err;
    
    inquirer.prompt([
      {
        type: "list",
        message: "Which employee would you like to update?",
        name: "chooseEmployee",
        choices: function() {
          var employeeArray = [];
          for (var i = 0; i < responseEmp.length; i++) {
            employeeArray.push(`${responseEmp[i].first_name} ${responseEmp[i].last_name}`);
          }
          return employeeArray;
        }},
        {
          type: "list",
          message: "New Role:",
          name: "updateRole",
          choices: function() {
            var roleArray = [];
            for (var i = 0; i < responseRole.length; i++) {
              roleArray.push(responseRole[i].title);
            }
            return roleArray;
          }
        }
     ])
      .then((res)=>{
        let name = res.chooseEmployee.split(" ");
        let first = name[0];
        let last = name[1];

        var upRole;
      for (var i = 0; i < responseRole.length; i++) {
        if (responseRole[i].title === res.updateRole) {
          upRole = responseRole[i].id;
        }
      }
        db.query("UPDATE employee SET ? WHERE ? AND ?", [
            {
              role_id: upRole
            },
            {
              first_name: first
            },
            {
              last_name: last
            }        
          ],

          function (err, res) {
            if (err) throw err;
            console.log("Employee has been updated.")
            start();
            return res;
          }
        ) 
        
      })   
    })
  })
}

//delete employee
function removeEmployee(){
  db.query("SELECT * FROM employees", function (err,response) {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "list",
        message: "Which employee would you like to remove?",
        name: "chooseEmployee",
        choices: function() {
          var employeeArray = [];
          for (var i = 0; i < response.length; i++) {
            employeeArray.push(`${response[i].first_name} ${response[i].last_name}`);
          }
          return employeeArray;
        }},
     ])
    .then((res)=>{
      let name = res.chooseEmployee.split(" ");
      let first = name[0];
      let last = name[1];

      db.query("DELETE FROM employee WHERE ? AND ?", [
          {
            first_name: first
          },
          {
            last_name: last
          }        
        ],

        function (err, res) {
          if (err) throw err;
          console.log("Employee has been removed.")
        
        }
      ) 
    })   
  })
}
start()
