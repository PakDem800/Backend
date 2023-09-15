![image](https://github.com/PakDem800/Backend/assets/139385935/54c67b9f-b9ae-4122-b746-7ae847adedb0)# PAKDEM Developers Portal - Backend

## Overview
Welcome to the backend of the PAKDEM Developers Portal. PAKDEM is a company specializing in providing plots for both housing and commercial purposes within the MMCB Society. This backend system includes a range of functionalities such as managing application files, generating receipts for each payment record, creating plots, and tracking office expenditures.

## Getting Started
Follow these steps to get the MMBC Society Plots Backend application up and running on your local environment:

Open command prompt on your pc and then:

1. **Clone the Repository**
   ```
   git clone https://github.com/PakDem800/Backend.git
   ```

2. **Install Dependencies**
   ```
   cd Backend
   npm i
   ```
3. **Create .env file**

in Backend folder of your machine create a file with name **.env**

 **Database Connection**
To connect the SQL Server database with the Node app, Prisma is used.In `.env` file add this line as:
```
DATABASE_URL="SERVER://HOST:PORT;database;user;password;encrypt"
```
 **JWT TOKEN KEY**
For authentication and authorization, a secret key is required. Add this key to the `.env` file as follows:
```
SECRET_KEY=MyJWTSecretKey
```

4. **Start the Application Server**
   ```
   npm start
   ```


## Routes
The application utilizes API routes, and they are organized in a folder named "routes." The routes are closely aligned with the frontend functionality. Additional routes have also been designed for future expansion and features.

## Technology Stack
- **Node.js**: The backend of the application is developed using Node.js.
- **Express**: Express.js is used for building RESTful APIs.
- **JWT Token**: JSON Web Tokens are employed for authentication and authorization.
- **Prisma**: Prisma is used to connect to the SQL Server database. Refer to [this link](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/connect-your-database-node-sqlserver) for setup instructions.
- **Database**: The application connects to a SQL Server database.
- **Port**: The Node app runs on port 4000.

## Dependencies
Ensure you have the following versions installed:
- Node.js: 16.17.0
- NPM: 8.15.0

Other dependencies can be found in the `package.json` file.

## Database Connection
To connect the SQL Server database with the Node app, Prisma is used. After applying Prisma functionality, add an `.env` file in the root directory with the following format:
```
DATABASE_URL="SERVER://HOST:PORT;database;user;password;encrypt"
```

## Authentication and Authorization
For authentication and authorization, a secret key is required. Add this key to the `.env` file as follows:
```
SECRET_KEY=MyJWTSecretKey
```

## Usage
The backend system provides essential functionalities for the PAKDEM Developers Portal. It serves as the backbone for managing plot records, payments, and more. Ensure that the frontend application is properly integrated with this backend to offer a seamless experience to users.

## Contribution
We welcome contributions to enhance the functionality and robustness of the PAKDEM Developers Portal backend. To contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Implement your changes and rigorously test them.
4. Submit a pull request, detailing the changes you've made.

Thank you for contributing to the PAKDEM Developers Portal project!

For any questions or support, please reach out to our development team at [PakDem](mailto:PakDem800@gmail.com).
