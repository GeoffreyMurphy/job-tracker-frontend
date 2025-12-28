# Job Tracker Frontend

A simple frontend for the Job Tracker application, built with **React**, **TypeScript**, and **Vite**.

It connects to the Job Tracker backend (Java + Spring Boot + PostgreSQL) and lets you:

- View all job applications
- Create new jobs
- Update the status of existing jobs
- Delete jobs
- Filter jobs by status (All / Applied / Interview / Offer / Rejected / Accepted)

---

## Tech Stack

- **React** (with hooks)
- **TypeScript**
- **Vite** (dev server and build tool)
- **CSS** for styling
- **Fetch API** for calling the backend

---

## Prerequisites

- Node.js and npm installed
- The Job Tracker backend running locally on `http://localhost:8080`

The backend exposes endpoints like:

- `GET /jobs`
- `POST /jobs`
- `PUT /jobs/{id}`
- `DELETE /jobs/{id}`

---

## Getting Started

1. Clone this repository
2. Install dependencies:

```bash
npm install
````

3. Start the dev server:

```bash
npm run dev
```

4. Open the URL shown in the terminal (usually):

```text
http://localhost:5173
```

Make sure the backend is also running so the frontend can load and modify jobs.

---

## Features

* Job list fetched from the backend API (`GET /jobs`)
* Form to add a new job (company, title, status, notes)
* Status dropdown on each job card to move applications through stages
* Delete button to remove jobs
* Filter bar to show only jobs with a specific status

---

## Possible Improvements

* Add authentication and user accounts
* Add pagination or search
* Improve visual design and responsiveness