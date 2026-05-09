# Employee Transport ERP (LTRMS)

A comprehensive Logistics and Transport Management System (LTRMS) designed to manage employee transportation, resources, and planning efficiently.

## 🚀 Overview

This project is a full-stack ERP solution for managing employee transport operations. It provides tools for resource management (drivers, vehicles, agencies), internal infrastructure tracking (plant sections, stations, paths), and complex transport planning.

## 🛠️ Technology Stack

### **Backend**
- **Framework:** [Spring Boot 3.4.2](https://spring.io/projects/spring-boot)
- **Language:** Java 23
- **Database:** PostgreSQL
- **Security:** Spring Security with JWT (JSON Web Tokens)
- **API Documentation:** Swagger/OpenAPI (SpringDoc)
- **Utilities:** Lombok, Apache POI (Excel support), Java Mail Sender

### **Frontend**
- **Framework:** [Angular 19](https://angular.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Angular Material](https://material.angular.io/), [NG-ZORRO](https://ng.ant.design/)
- **State Management:** RxJS
- **Icons:** FontAwesome
- **Internationalization:** @ngx-translate

---

## 📂 Project Structure

```text
employee-transport-erp/
├── backend/
│   └── LTRMS-BACKEND/       # Spring Boot Application
│       ├── src/main/java    # Source code
│       ├── src/main/resources # Config and Assets
│       └── pom.xml          # Maven dependencies
├── frontend/
│   └── LTMS-project/        # Angular Application
│       ├── src/app          # Components, Services, Pages
│       ├── src/assets       # Static assets
│       └── package.json     # Node.js dependencies
└── README.md                # Project documentation
```

---

## ✨ Features

- **Resource Management:**
  - **External:** Manage transport agencies, drivers, and vehicles.
  - **Internal:** Track employees, plant sections, segments, stations, and paths.
- **Planning & Logistics:**
  - Import transport plans from external sources.
  - Manage and optimize daily transport schedules.
- **Financials:**
  - Billing and invoice management (Factures).
  - Employee contribution tracking and exemptions.
- **Administration:**
  - Robust User Management with Roles and Permissions.
  - Work shift administration and configuration.
- **Security:**
  - HTTPS/SSL enabled communication.
  - JWT-based authentication and route guarding.

---

## 🚦 Getting Started

### **Prerequisites**
- **Java 23** or higher
- **Node.js** (LTS version recommended)
- **Angular CLI** (`npm install -g @angular/cli`)
- **Maven**
- **PostgreSQL**

### **Backend Setup**
1. Navigate to the backend directory:
   ```bash
   cd backend/LTRMS-BACKEND
   ```
2. Configure your database in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/your_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The server will start on `https://localhost:9999`.*

### **Frontend Setup**
1. Navigate to the frontend directory:
   ```bash
   cd frontend/LTMS-project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   ng serve
   ```
   *Access the app at `http://localhost:4200`.*

---

## 📄 License

This project is private and intended for use by **Sindibad Group**.
