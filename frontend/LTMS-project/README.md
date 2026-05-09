# LTMS Project

Welcome to the LTMS Project! This guide will help you set up and run the project on your local machine using the Angular CLI and Node.js CLI.

## Prerequisites

Make sure you have the following installed on your system:

- Node.js (Recommended: latest LTS version)  
  [Download Node.js](https://nodejs.org/)
- Angular CLI (Recommended: latest version)  
  [Angular CLI Documentation](https://angular.io/cli)
- npm (Node Package Manager)  
  [Visit npm](https://www.npmjs.com/)
- Git (for cloning the repository)  
  [Download Git](https://git-scm.com/)

## Installation Steps

### 1. Install Angular CLI

If you haven't installed Angular CLI yet, run:

```sh
npm install -g @angular/cli
```

### 2. Clone the Repository

```sh
git clone https://github.com/ImAzIz19/LTMS-project.git
```

### 3. Navigate to the Project Directory

```sh
cd LTMS-project
```

### 4. Install Dependencies

```sh
npm install
```

### 5. Run the Development Server

```sh
ng serve
```

This will start the Angular development server. By default, the project will be available at:

```
http://localhost:4200/
```

## Building the Project

To create a production build, run:

```sh
ng build --prod
```

This will generate optimized files inside the `dist/` folder.

## Running with Node.js CLI

If your project requires a Node.js backend, navigate to the backend directory and follow these steps:

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the Node.js server:
   ```sh
   npm start
   ```

## Additional Commands

- **Lint the project:**
  ```sh
  ng lint
  ```
- **Run unit tests:**
  ```sh
  ng test
  ```
- **Run end-to-end tests:**
  ```sh
  ng e2e
  ```

## Contributing

Feel free to fork the repository and submit pull requests.

## License

This project is licensed under the MIT License.

---

Happy coding! 🚀

