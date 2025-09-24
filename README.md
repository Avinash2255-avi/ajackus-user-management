📌 Overview

A responsive User Management Dashboard built with React + Vite.
It allows you to view, add, edit, delete, search, filter, sort, and paginate users using the JSONPlaceholder
 mock API.

This project demonstrates:

Frontend API interaction

Dynamic UI updates

Form validation

Error handling

Responsive design for desktop & mobile

🚀 Live Demo

🔗 Deployed Link
 (replace with your Netlify / Vercel / GitHub Pages link)

🛠️ Tech Stack

Framework: React (Vite)

HTTP Client: Fetch API

Styling: Custom CSS (responsive)

Testing: Jest + React Testing Library (optional)

✨ Features

📄 User List (ID, First Name, Last Name, Email, Department)

➕ Add User (client-side, optimistic update)

✏️ Edit User (prefilled form, simulated PUT)

❌ Delete User (confirmation + simulated DELETE)

📑 Pagination (10, 25, 50, 100 per page)

🔍 Search (debounced, across all fields)

🎯 Filter (First Name, Last Name, Email, Department via modal)

↕️ Sorting (ID numeric-safe, First/Last Name, Email, Department)

📱 Responsive UI (mobile-friendly with table scroll)

✅ Validation (required fields, email regex)

⚡ Error Handling (API failures & client validation)