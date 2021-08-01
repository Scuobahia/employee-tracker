USE tech_employees;

INSERT INTO department 
    (name)
VALUES 
    ("Legal"),
    ("Administration"),
    ("Developers");

INSERT INTO role 
    (title, salary, department_id)
VALUES 
    ("Attorney", 250000, 1),
    ("CEO", 900000, 2),
    ("CFO", 700000, 2),
    ("Senior Developers", 500000, 3),
    ("Junior Developers", 250000, 3),
    ("User Experience Developers", 45000, 3);

INSERT INTO employees
    (first_name, last_name, role_id, manager_id)
VALUES
    ("Bob", "Belcher", 6, 3),
    ("Antonio", "Sanchez", 2, null),
    ("Rick", "Sanchez", 3, null),
    ("Mortimer", "Smith", 4, null),
    ("Louise", "Belcher", 4, null),
    ("Frodo", "Baggins", 4, null),
    ("Eren", "Yeager", 5, null),
    ("Erwin", "Smith", 5, null),
    ("Historia", "Reiss", 6, 3);