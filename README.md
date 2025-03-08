# Ebus Management System

## 🚀 Project Overview
The **Ebus Management System** is a web-based application that allows passengers, drivers, and admins to efficiently manage bus tracking and journey statuses in real-time. The system is built using **React.js** and **Firebase** to provide a seamless and responsive user experience.

## 🛠️ Tech Stack Used
- **Frontend:** React.js, Tailwind CSS, Leaflet.js (for live tracking)
- **Backend:** Firebase Firestore (NoSQL database), Firebase Authentication
- **Hosting:** Firebase Hosting

## 📌 Key Features & Workflow
### 🔹 Passenger
- View available buses & search based on source/destination.
- Track the live location of an ongoing journey.

### 🔹 Driver
- Register and request approval from admin.
- Add bus details and start/stop journey tracking.
- View past journey history.

### 🔹 Admin
- Approve or reject driver registration requests.
- Manage drivers and buses.

## ⚙️ Installation & Setup
To set up the project locally, follow these steps:

1. **Clone the Repository:**
   ```bash
   https://github.com/Suriyamadhubalan/E-Bus-management-app.git
   cd ebus-management
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Set Up Firebase:**
   - Create a Firebase project.
   - Enable **Authentication (Email/Password)**.
   - Create Firestore collections: `users`, `busses`, `driverRequests`.
   - Obtain Firebase config and add it to `.env` file.

4. **Start the Project:**
   ```bash
   npm start
   ```

## 🏗️ Project Folder Structure
```
├── src
│   ├── components  # Reusable UI components
│   ├── pages        # Different page components
│   ├── context     # Context API for authentication
│   ├── utils       # Utility functions
│   ├── assets      # Images and icons
│   ├── App.js      # Main app component
│   ├── index.js    # Entry point
└── public         # Static files
```

## 🎯 Future Improvements 
- Add push notifications for journey updates.
- Improve UI/UX with advanced animations.
- Implement payment integration for bookings.

## 📝 Conclusion
This project successfully implements a bus tracking system using Firebase and React.js. The structured workflow ensures smooth functionality for passengers, drivers, and admins.


