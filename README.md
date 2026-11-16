# Employee Leave Management System (Salesforce LWC & Apex)

A robust, cloud-native **Employee Leave Management System** built on the Salesforce platform using **Lightning Web Components (LWC)**, **Apex Controllers**, and custom object schemas. This application allows employees to seamlessly submit and track leave requests while empowering managers to review, filter, and approve or reject submissions in real-time.

---

## 🚀 Key Features

* **Interactive Leave Request Form**: Employees can input their Name, Email, Leave Type (Casual, Sick, Earned), Start Date, End Date, and Reason.
* **Automatic Duration Calculation**: Dynamically computes the total leave duration (in days) based on the selected date range.
* **Status Filtering**: Instantly filter leave records by **All**, **Pending**, **Approved**, or **Rejected**.
* **Administrative Approvals**: Inline row-level actions (`Approve` and `Reject`) allowing managers to update request statuses instantly with UI auto-refresh.
* **Clickable Record Navigation**: Request IDs render as clickable links that direct users straight to the detailed Salesforce record view.
* **Robust Backend Validation**: Enforces secure DML operations and date-range validation rules via custom Apex controllers.

---

## 🛠️ Tech Stack & Architecture

* **Frontend**: Salesforce Lightning Web Components (LWC), HTML5, JavaScript (ES6), CSS (SLDS).
* **Backend**: Apex Classes (`LeaveRequestController.cls`) and SOQL queries.
* **Database / Data Model**: Custom Salesforce Object (`Leave_Request__c`) with standard and custom fields linked to user records.
* **Deployment Tooling**: Salesforce CLI / VS Code / Code Builder.

---

## 📁 Project Directory Structure

```text
force-app/
│
└── main/
    └── default/
        ├── classes/
        │   ├── LeaveRequestController.cls
        │   └── LeaveRequestController.cls-meta.xml
        │
        └── lwc/
            └── leaveManagement/
                ├── leaveManagement.html
                ├── leaveManagement.js
                └── leaveManagement.js-meta.xml
