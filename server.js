const inquirer = require('inquirer');
const db = require('./db');


const startApp = () => {
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
    switch (res.start) {
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
    }
  })
};

startApp();


