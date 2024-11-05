# Tenant_Maintenance_Request_Management_WebApp

## To run the project

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.  
You may also see any lint errors in the console.

## Login Credentials

### Manager
Email: `m1@gmail.com`

### Maintenance Team
Email: `mt1@gmail.com`

### Tenant
Email: `t1@gmail.com`

**Note**: Any `tenantID` that the manager adds or deletes in the application can be used as a login credential. Any password will work for these user IDs.

## Database Description

I have used Firebase for this project.

The Firestore database features the following collections:

- **tenants**:
  - **tenantID** (String): The unique identifier for each tenant.
  - **name** (String): The name of the tenant.
  - **phone** (String): The phone number of the tenant.
  - **email** (String): The email address of the tenant.
  - **checkInDate** (Timestamp): The date the tenant checked in.
  - **checkOutDate** (Timestamp): The date the tenant checked out.
  - **apartmentNumber** (String): The tenant's assigned apartment number.

- **requests**:
  - **requestID** (String): A unique identifier for each maintenance request.
  - **tenantID** (String): The unique identifier for the tenant making the request.
  - **apartmentNumber** (String): The tenant's apartment number.
  - **area** (String): The area of the issue (e.g., Kitchen, Bedroom).
  - **description** (String): A description of the maintenance issue.
  - **dateTime** (Timestamp): The timestamp of when the request was created.
  - **photoURL** (Boolean): Indicates if a photo was uploaded (true if uploaded, false otherwise).
  - **status** (String): The status of the request (e.g., pending, complete).

- **users**:
  - **userID** (String): A unique identifier for each user.
  - **email** (String): The email address of the user.
  - **role** (String): The role of the user (e.g., Manager, Maintenance Team, Tenant).

The structure of these collections allows for efficient management and querying of tenant and maintenance request data, while also providing secure access control.

## File Description

#### App.js:
This is the main entry point of the application, setting up the routing structure using React Router. It defines routes for the login page, ManagerDashboard, MaintenanceDashboard, and TenantDashboard, directing users to the appropriate interface based on their role.

#### TenantDashboard.js:
This component allows tenants to submit maintenance requests. It collects the tenant's apartment number, selected area using radio buttons, and a description of the issue. Tenants can also choose to upload a photo. Submitted requests are saved to Firestore with a "pending" status.

#### ManagerDashboard.js:
This component provides managers with functionality to add, move, and delete tenants. It updates the `tenants` and `users` collections in Firestore and includes UI features for better management and user interaction. The manager can also update existing tenant details and view a list of tenants.

#### MaintenanceDashboard.js:
This component allows maintenance team members to view and filter maintenance requests. It features toggling of request status between "pending" and "complete" and updates the status in the database. The UI includes filtering options and consistent colors for a user-friendly experience.

#### App.css:
This file contains styles for the entire application, ensuring a cohesive look and feel across all components. It includes styling for the dashboard layouts, form elements, radio buttons, and general design elements for a professional and intuitive interface.
