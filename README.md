# Event Logging System

## Overview

The **Event Logging System** is an API designed to log events, verify their consistency, and allow users to fetch event data with support for pagination, filtering, and a dashboard interface. It uses MongoDB to store event logs and employs Express.js for the server-side framework.

## Features

- **Event Logging**: Log events with type, source application ID, and data payload.
- **Event Fetching**: Retrieve events with filters and pagination options.
- **Consistency Check**: Each event is checked for consistency and validated.
- **Dashboard**: A web-based dashboard to view and manage events.
- **Filters**: Apply various filters (e.g., event type, timestamp) while fetching events.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: HTML, CSS (with minimal JavaScript for dynamic operations)
- **Authentication**: None (API-based with no user authentication for simplicity)

## Installation

### Prerequisites

- **Node.js**: Ensure Node.js is installed on your system. If not, download it from [nodejs.org](https://nodejs.org).
- **MongoDB**: Make sure MongoDB is installed and running locally or use a remote MongoDB URI.

### Steps

1. **Clone the repository**:

   ```bash
   git clone <repository_url>
   cd event-logging-system

### Install Dependencies

2. **Install the required dependencies using npm**:

   ```bash
   npm install

### Set up environment variables:

3. **Create a .env file in the root of the project with the following content**:

   ```bash
   MONGO_URI=mongodb://127.0.0.1:27017/eventLogs

If you're using a remote MongoDB instance, update the MONGO_URI with your MongoDB connection string.

### Start the server:

4. **Start the application using the following command**:

   ```bash

   npm start

The server will be running at http://localhost:5000.

# File Structure

 Here’s an overview of the project’s file structure

   ```

   event-logging-system/
   ├── config/
   │   └── db.js                # MongoDB  connection setup
   ├── controllers/
   │   └── eventController.js    # Logic for handling event-related routes
   ├── models/
   │   └── Event.js              # Mongoose model for events
   ├── public/
   │   ├── dashboard.html        # Dashboard page (used for event viewing)
   │   ├── test.html             # HTML page for logging events and displaying them
   │   └── css/
   │       └── test.css          # Styles for the frontend
   ├── routes/
   │   └── eventRoutes.js        # API routes for handling event operations
   ├── .env                      # Environment variables file (e.g., Mongo URI)
   ├── server.js                 # Main server setup
   └── package.json              # NPM dependencies and scripts
```

### Endpoints

``` POST /api/events/log-event```
Description: Log a new event. The request body should contain the following fields:

eventType: Type of the event (e.g., "user_login").

sourceAppId: ID of the source application generating the event.

dataPayload: JSON object containing event-related data.

Example Request:

   ```json

   {
     "eventType": "user_login",
     "sourceAppId": "app123",
     "dataPayload": "{\"userId\": \"abc123\", \"loginTime\": \"2024-11-24T10:00:00Z\"}"
   }
```
Response:

Status: 201 (Created) on success.

Status: 400 (Bad Request) if the request body is missing required fields or contains invalid data.

## GET /api/events
Description: Fetch a list of events with pagination and optional filters. You can specify the following query parameters:

page: Page number (default: 1).

limit: Number of events per page (default: 10).

sort: Field to sort events by (default: timestamp).

order: Sorting order (asc or desc, default: desc).

timestampStart: Filter by start date.

timestampEnd: Filter by end date.

eventType: Filter by event type.

sourceAppId: Filter by source application ID.

**Example Request:**

```GET /api/events?page=1&limit=10&sort=timestamp&order=desc&eventType=user_login```

Response:

Status: 200 OK with event data and pagination info.

```GET /api/events/dashboard```

Description: Serve the dashboard HTML page.

Example Request:

```
GET /api/events/dashboard ```

Response:

Returns the dashboard.html page for users to interact with.
Database Schema
The Event schema defines the structure for event documents in MongoDB:

eventType: Type of event (string).
timestamp: Date when the event was logged (default: current timestamp).
sourceAppId: Source application ID (string).
dataPayload: Data related to the event (object).
inconsistencies: List of inconsistencies found in the event (array of strings).
previousHash: Hash of the previous event (string).
hash: Hash of the current event (string).

Event Consistency Check
Before logging any event, it undergoes a consistency check:

Missing eventType: The event will not be logged if the eventType is not provided.
Missing sourceAppId: The event will not be logged if the sourceAppId is missing.
Invalid or missing dataPayload: The event will not be logged if the dataPayload is not a valid object or is missing.
Frontend
The frontend consists of basic HTML forms and UI components:

test.html: A form where users can log events.
dashboard.html: A simple dashboard page served at /api/events/dashboard to interact with event data.
test.html
This page allows users to log events by filling out a form with the event type, source application ID, and data payload.

dashboard.html
The dashboard displays logged events, allowing users to view and filter the events.

Contributing
Contributions are welcome! If you would like to contribute to the project, follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature-name).
Make your changes.
Commit your changes (git commit -am 'Add feature').
Push to the branch (git push origin feature-name).
Open a pull request.
Ensure to write tests for new features and document any changes you make.
License
This project is licensed under the MIT License - see the LICENSE file for details.


### Key Sections of the `README.md`:

- **Overview**: Describes the purpose and key functionality of the system.
- **Features**: Lists the main features of the Event Logging System.
- **Tech Stack**: Specifies the technologies used in the project.
- **Installation**: Provides detailed steps for setting up the project on your local machine.
- **File Structure**: Shows the organization of the project files and folders.
- **Endpoints**: Describes the API endpoints, their methods, and the expected request/response formats.
- **Database Schema**: Explains the structure of the event data stored in MongoDB.
- **Event Consistency Check**: Lists the checks that ensure the event data is valid before logging.
- **Frontend**: Details the basic HTML UI files used for event logging and dashboard viewing.
- **Contributing**: Instructions for contributing to the project.
- **License**: States the project’s license type.




