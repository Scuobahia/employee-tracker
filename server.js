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
      'Add New Role',
      'Add New Department',
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
      case "Update an Employee Role":
          updateEmployee();
          break;  
      case 'Add New Employee':
          addEmployee();
          break;
      case 'Add New Role':
          addRole();
          break;
      case 'Add New Department':
          addDepartment();
          break;
      case 'Remove An Employee':
          removeEmployee();
          break;
          case "Exit":
            console.log("Thanks for using Employee Tracker!")
            db.end();
          break;
    }
  });
};
//View All Employees
function viewEmployees(){
  db.query("SELECT employees.id, employees.first_name, employees.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM department INNER JOIN role ON department.id = role.department_id INNER JOIN employees ON role.id = employees.role_id LEFT JOIN employees manager ON employees.manager_id = manager.id ORDER BY employees.id ASC", 
  (err,res) => {
    console.log(res)
    if(err) throw err;
      console.table(res);
      start();
    });
  
};
//View All Departments
function viewDepartment(){
  db.query("SELECT * FROM  department",(err,res) => {
    if (err) throw err;
      console.table(res);
      start();
    });
  
};
//View All Roles
function viewRoles(){
  db.query("SELECT role.id, title, name, salary FROM role INNER JOIN department ON role.department_id = department.id ORDER BY id ASC", function(err,res){
    if (err) throw err;
    console.table(res)
    start();
  })
}

//Update An Employee Role
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
        db.query("UPDATE employees SET ? WHERE ? AND ?", [
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
            console.log("Employees has been updated.")
            start();
            return res;
          }
        ) 
        
      })   
    })
  })
}

//Add New Department
function addDepartment(){
  inquirer.prompt({
    type: "input",
    message: "Enter department name:",
    name: "newDepartment"
  })
  .then((res) => {
      db.query("INSERT INTO department SET ?", {
        name: res.newDepartment
      });
      console.log("Department added");

      start();
    });
}


//Add New Role
function addRole() {
  db.query("SELECT * FROM department", function(err, response) {
    if (err) throw err;
    inquirer
      .prompt([
      {
      type: "input",
      message: "Enter job title:",
      name: "newTitle"
      },
      {
      type: "input",
      message: "Enter annual salary:",
      name: "newSalary"
      },
      {
      type: "list",
      message: "Enter department:",
      name: "dept",
      choices: function() {
        var deptArray = [];
        for (var i = 0; i < response.length; i++) {
          deptArray.push(response[i].name);
        }
        return deptArray;
      }}
  ])
  .then((res) => {
     var chosenDept;
     for (var i = 0; i < response.length; i++) {
      if (response[i].name === res.dept) {
        chosenDept = response[i].id;
      }
    }
      db.query("INSERT INTO role SET ?", {
        title: res.newTitle,
        salary: res.newSalary,
        department_id: chosenDept
      });
      console.log("Role added");
      start();
    });
  });
}


//Add New Employee
function addEmployee() {
  db.query("SELECT * FROM employees", function(err, responseEmp) {
    if (err) throw err;
    db.query("SELECT * FROM role", function(err, responseRole){
  
    if (err) throw err;
    inquirer
      .prompt([
    {
    type: "input",
    message: "Enter first name:",
    name: "firstname"
    },
    {
    type: "input",
    message: "Enter last name:",
    name: "lastname"
    },
    {
    type: "list",
    message: "Enter role:",
    name: "roleID",
    choices: function() {
      var roleArray = [];
      for (var i = 0; i < responseRole.length; i++) {
        roleArray.push(responseRole[i].title);
      }
      return roleArray;
    }},
    {
    type: "list",
    message: "Choose manager:",
    name: "managerID",
    choices: function(){
    var managers = [];
    for (var i=0; i < responseEmp.length; i++){
      if(responseEmp[i].manager_id === null){
        managers.push(`${responseEmp[i].first_name} ${responseEmp[i].last_name}`);
    }};
    managers.push("None")
    return managers;
    }}
  ])

    .then((res) => {
      var chosenRole;
      for (var i = 0; i < responseRole.length; i++) {
        if (responseRole[i].title === res.roleID) {
          chosenRole = responseRole[i].id;
        }
      }
      var chosenMngr;
      for (var i = 0; i < responseEmp.length; i++) {
        if (`${responseEmp[i].first_name} ${responseEmp[i].last_name}` === res.managerID) {
          chosenMngr = responseEmp[i].id;
        } else if (res.managerID === "None"){
          chosenMngr = null
        }
      }
        db.query("INSERT INTO employees SET ?", {
          first_name: res.firstname,
          last_name: res.lastname,
          role_id: chosenRole,
          manager_id: chosenMngr
        });
        console.log("Employee added");
        start();
      });
  })
  })
}

//Delete An Employee
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

      db.query("DELETE FROM employees WHERE ? AND ?", [
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
          start();
          return res;
        }
      ) 
    })   
  })
}

start();
