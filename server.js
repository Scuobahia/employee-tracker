const inquirer = require('inquirer');
const db = require('./db');

const PORT = process.env.PORT || 3001;
const app = express();


const startApp = () => {
  inquirer.prompt( {
    name: 'action',
    type: 'list',
    message: 'What would you like to do today?'
    choices: [
      'View All Employees',
      'View All Departments',
      'View All Roles',
      'Update an Employee Role',
      'Add new Employee',
      'Remove An Employee',
      'Exit'
    ],
  })
  .then((res) => {
    switch (res.start) {
      case 'View All Employees':
        viewEmployees
    }
  }
  )
}





// Default response for any other request (Not Found). Should be placed LAST!
app.use((req, res) => {
    res.status(404).end();
  });
  
  // Express server function
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });