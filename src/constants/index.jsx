import {FaChartLine,
  FaHome,FaArchive,FaShoppingCart,
  FaUser,FaHistory,
  FaUsers,
FaUserCircle
} from "react-icons/fa";


export const EmployeesNavbar = [
    {
    
      "id":"1",
      "label": "Home",
      "link": "/employee/",
      "icon":FaHome
    },
    {"id":"2",
      "label": "Order Details",
      "link": "/employee/orderdetails",
      "icon":FaShoppingCart 
    },
    {
      "id":"3",
      "label": "Accounts History",
      "link": "/employee/accountsdetails",
      "icon":FaHistory
    },
    {
      "id":"4",
      "label": "Inventory",
      "link": "/employee/inventory",
      "icon":FaArchive
    },
    {
      "id":"5",
      "label": "Profile",
      "link": "/employee/profile",
      "icon":FaUser
    }
    
    
  ];
  
  export const menuContent=[
    {
      "name":"Simple Chaye",
      "decs":"this is item1 description",
      "price":70,
      "img":'/vite.svg',
      "catagory":"Drinks"
    },
    {
      "name":"GurWali Chaye",
      "decs":"this is item2 description",
      "price":100, 
      "img":'/vite.svg',
      "catagory":"Appatizers"
    },
    {
      "name":"Masala Chaye",
      "decs":"this is item3 description",
      "price":100,
      "img":'/vite.svg',
      "catagory":"Salad"

    },
    {
      "name":"Tandoori Chaye",
      "decs":"this is item3 description",
      "price":100,
      "img":'/vite.svg',
      "catagory":"Salad"
    }

  ]

  export const AdminNavbar = [
    {
      "label": "Home",
      "link": "/Admin/",
      "icon":FaHome

    },
    {
      "label": "Manage Employees",
      "link": "/Admin/manageemployees",
      "icon":FaUsers
    },
    {
      "label": "Accounts",
      "link": "/Accounts",
      "icon":FaChartLine
    },
    {
      "label": "Inventory",
      "link": "/admin/manageinventory",
      "icon":FaArchive
    },
    {
      "label": "Manage Profile",
      "link": "/admin/manageprofile",
      "icon":FaUserCircle
    }
  ];
  
  export const orderdetailsTable = [
    {
      "id": "001",
      "customerName": "John Doe",
      "orderDate": "2023-05-01 12:30",
      "location": "Table 5",
      "items": [
        { "name": "Pizza", "quantity": 1 },
        { "name": "Coke", "quantity": 2 }
      ],
      "specialInstructions": "No onions",
      "status": "Pending",
      "totalAmount": "Rs  20.00",
      "paymentStatus": "Paid",
      "deliveryMethod": "Dine-in",
      "employee": "Jane Smith"
    },
    {
      "id": "002",
      "customerName": "Emily Johnson",
      "orderDate": "2023-05-01 12:45",
      "location": "Table 3",
      "items": [
        { "name": "Burger", "quantity": 2 },
        { "name": "Fries", "quantity": 1 }
      ],
      "specialInstructions": "Extra cheese",
      "status": "In Progress",
      "totalAmount": "Rs  15.50",
      "paymentStatus": "Unpaid",
      "deliveryMethod": "Dine-in",
      "employee": "Michael Brown"
    },
    {
      "id": "003",
      "customerName": "Michael Brown",
      "orderDate": "2023-05-01 13:00",
      "location": "Table 2",
      "items": [
        { "name": "Pasta", "quantity": 1 },
        { "name": "Salad", "quantity": 1 }
      ],
      "specialInstructions": "No dressing",
      "status": "Completed",
      "totalAmount": "Rs  18.00",
      "paymentStatus": "Paid",
      "deliveryMethod": "Dine-in",
      "employee": "Sarah Davis"
    },
    ]
  export const catagory=[
    {
      "id":"1",
      "name":"All"
    },
    {
      "id":"2",
      "name":"Drinks",
      
    },
    {
      "id":"3",
      "name":"Salads",
    },
    {
      "id":"4",
      "name":"Appatizers"
    },
  ]
  // Financial Accounts Data
  export const financialAccounts = [
    {
      id: 1,
      name: 'John Doe',
      type: 'Savings',
      balance: 5000
    },
    {
      id: 2,
      name: 'Jane Smith',
      type: 'Checking',
      balance: 3800
    },
    
  ];

// Employee Accounts Data
const employeeAccounts = [
  {
    employeeId: 'EMP001',
    name: 'John Doe',
    position: 'Manager',
    salary: 4000,
    incentives: 500,
    bonuses: 1000,
    totalCompensation: 5500
  },
  {
    employeeId: 'EMP002',
    name: 'Jane Smith',
    position: 'Waiter',
    salary: 2000,
    incentives: 300,
    bonuses: 600,
    totalCompensation: 2900
  },
  // Add more employee accounts as needed
];

export const accountsHistoryTable = [
  {
    accountId: 'A001',
    accountHolderName: 'John Doe',
    transactions: [
      {
        transactionId: 'T001',
        transactionDate: '2024-01-01',
        transactionAmount: '100.00',
        transactionType: 'Credit',
        balance: '1100.00',
        transactionStatus: 'Completed'
      },
      {
        transactionId: 'T002',
        transactionDate: '2024-01-05',
        transactionAmount: '50.00',
        transactionType: 'Debit',
        balance: '1050.00',
        transactionStatus: 'Completed'
      }
    ]
  },
  {
    accountId: 'A002',
    accountHolderName: 'Jane Smith',
    transactions: [
      {
        transactionId: 'T003',
        transactionDate: '2024-02-10',
        transactionAmount: '200.00',
        transactionType: 'Credit',
        balance: '1200.00',
        transactionStatus: 'Pending'
      },
      {
        transactionId: 'T004',
        transactionDate: '2024-02-15',
        transactionAmount: '150.00',
        transactionType: 'Debit',
        balance: '1050.00',
        transactionStatus: 'Completed'
      }
    ]
  }
];
export const inventoryTable = [
  {
    id: 1,
    itemName: 'Item A',
    category: 'Category 1',
    quantity: 100,
    price: 10.00,
    supplier: 'Supplier X',
    lastUpdated: '2024-05-01',
    status: 'In Stock'
  },
  {
    id: 2,
    itemName: 'Item B',
    category: 'Category 2',
    quantity: 50,
    price: 20.00,
    supplier: 'Supplier Y',
    lastUpdated: '2024-05-15',
    status: 'Low Stock'
  },
  {
    id: 3,
    itemName: 'Item C',
    category: 'Category 1',
    quantity: 0,
    price: 15.00,
    supplier: 'Supplier Z',
    lastUpdated: '2024-05-20',
    status: 'Out of Stock'
  },
  // Add more items as needed
];
const pettyCashTransactions = [
  { id: 1, date: '2024-05-30', description: 'Expense for ingredients', amount: -500 },
  { id: 2, date: '2024-05-31', description: 'Income from sales', amount: 1500 },
  // Add more petty cash transactions as needed
];

const ledgerEntries = [
  { id: 1, date: '2024-05-30', description: 'Salary payment for May', amount: -3000 },
  { id: 2, date: '2024-05-31', description: 'Revenue from orders', amount: 5000 },
  // Add more ledger entries as needed
];

const debitCreditTransactions = [
  { id: 1, date: '2024-05-30', description: 'Payment to supplier', amount: -1000 },
  { id: 2, date: '2024-05-31', description: 'Refund to customer', amount: -200 },
  // Add more debit/credit transactions as needed
];

const accounts =[
  { id: 1, username: 'admin', role: 'Admin', email: 'admin@example.com' },
  { id: 2, username: 'employee1', role: 'Employee', email: 'employee1@example.com' },
  { id: 3, username: 'employee2', role: 'Employee', email: 'employee2@example.com' },
]