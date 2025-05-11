
# School Vaccination Portal

**Student:** K N S Srilakshmi  
**Roll No:** 2024TM93297  
**Date:** May 11, 2025

## Project Overview

School Vaccination Portal is a full-stack web application built using the MERN stack to manage student vaccination data, schedule vaccination drives, and generate reports. The portal allows school coordinators to add students individually or via bulk Excel upload, manage vaccine records, and view real-time dashboards and reports.

### GitHub Repository
[School Vaccination app](https://github.com/srilakshmikalaga/schoolvaccination-application.git)

### Video Submission
https://drive.google.com/file/d/1nm8egTo2dfSLDXQX2g_9t_xLRX_8yice/view?usp=sharing

## Problem Definition

Manually managing student vaccination data is time-consuming and prone to error. This portal addresses those challenges by providing a structured, digital interface with features for real-time tracking, data entry, and reporting.

## Tech Stack

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Authentication**: : Simulated (Admin only)
- **API Documentation**: Swagger, Postman


### Key Modules:
1. **Admin Login**: Provides secure access control for authorized school staff.
2. **Student Management**:  Enables adding, editing, searching, and bulk uploading of student vaccination records.
3. **Vaccination Drives**: Allows scheduling and editing of drives with status tagging (Editable/Expired).
4. **Dashboard**: Displays real-time statistics through summary cards and interactive pie charts.
5. **Reports** : Generates exportable vaccination reports with advanced filtering and pagination.

## Installation

### 1. Clone the repository:

```bash
git clone https://github.com/srilakshmikalaga/schoolvaccination-application.git
cd school-vaccination
```

### 2. Backend Setup:

```bash
cd school-vaccination-backend
npm install
# Create a .env file with MONGO_URI
npm start
```

### 3. Frontend Setup:

```bash
cd school-vaccination-frontend
npm install
npm start
```

## References

- [MongoDB Documentation ](https://www.mongodb.com/docs/manual/)
- [React.js Official Docs ](https://reactjs.org/docs/getting-started.html)

