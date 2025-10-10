# 🧠 Daily AI

<p align="center">
  <img src="https://path-to-your-project-banner-image.png" alt="Daily AI Banner">
</p>

<p align="center">
  An all-in-one AI-powered platform built with the MERN Stack (React, Express, Node.js, PostgreSQL) to assist with content creation and image editing.
</p>
<br>

**Daily AI** integrates the power of the **Gemini API** and **ClipDrop API** to provide a seamless experience for generating articles, creating images, editing photos, and much more, all from a single dashboard. This project is designed for creators, developers, and anyone interested in exploring the capabilities of modern AI tools.

---

## 🚀 Key Features

| Feature            | Description                                                 | Icon |
| ------------------ | ----------------------------------------------------------- | :--: |
| **Dashboard** | View and manage all your AI tools from a central hub.       |  🏠  |
| **Write Article** | Generate high-quality articles and blog content with AI.    |  ✍️  |
| **Blog Titles** | Get instant, creative blog title suggestions.               |  🪶  |
| **Generate Images**| Create stunning AI-generated images using the Gemini API.   |  🖼️  |
| **Remove Background**| Automatically remove backgrounds from images via ClipDrop API.|  🧹  |
| **Remove Object** | Easily erase unwanted objects or people from your photos.   |  ✂️  |
| **Review Resume** | Get AI-based analysis and feedback on your resume.          |  📄  |
| **Community** | Connect with other users, share creations, and get inspired.|  👥  |

---

## 🖼️ Screenshots

Here's a glimpse of the application's user interface.

| Sidebar Navigation                                  |
| --------------------------------------------------- |
| ![Daily AI Sidebar](https://i.imgur.com/Qv99XhY.png) |

*(Feel free to add more screenshots of other features here!)*

---

## 🛠️ Tech Stack

This project is built using a modern and robust technology stack:

| Category      | Technologies                                    |
| ------------- | ----------------------------------------------- |
| **Frontend** | React.js, Tailwind CSS                          |
| **Backend** | Node.js, Express.js                             |
| **Database** | PostgreSQL                                      |
| **AI APIs** | Google Gemini API (Text & Image), ClipDrop API  |
| **Deployment**| Vercel (Frontend), Render (Backend) - *Optional*|

---

## ⚙️ Getting Started: Installation and Setup

Follow these steps to get the project up and running on your local machine.

### Prerequisites

-   Node.js (v18 or later)
-   npm / yarn
-   PostgreSQL installed and running

### 1. Clone the Repository

First, clone the project repository to your local machine.

```bash
git clone [https://github.com/your-github-username/daily-ai.git](https://github.com/your-github-username/daily-ai.git)
cd daily-ai
```
2. Backend Setup (Server)
Navigate to the server directory and install the required dependencies.

Next, create a .env file in the server folder. Copy the contents of .env.example (if you have one) or create it from scratch with the following variables:
PORT=5000
DATABASE_URL="your_postgresql_connection_string"
GEMINI_API_KEY="your_gemini_api_key"
CLIPDROP_API_KEY="your_clipdrop_api_key"

Once your environment variables are set, start the backend server.
npm run dev
The server should now be running on http://localhost:5000.

💡 How It Works
User Interaction: A user selects a tool from the sidebar on the React frontend (e.g., "Generate Images").

API Request: The frontend sends a request containing the user's input to the backend API built with Node.js and Express.

AI Processing: The backend server processes the request and calls the appropriate external API (Gemini or ClipDrop) to perform the AI task.

Response: The external API returns the result (e.g., a generated image URL or text), which the backend forwards to the frontend.

Display Result: The frontend displays the processed output to the user.

📁 Project Structure
The repository is organized into two main folders: client for the frontend and server for the backend.

📂 daily-ai/
├── 📂 client/           # React.js Frontend
│   ├── public/
│   └── src/
├── 📂 server/           # Node.js + Express.js Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js
├── 📜 .gitignore
└── 📜 README.md
