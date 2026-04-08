# 🚀 Job Tracker App

A modern full-stack Job Tracker web application to manage and visualize job applications efficiently.

## ✨ Features

* 📋 Add, update, and delete job applications
* 🔍 Search and filter by company, role, status, and source
* 📊 Dashboard with analytics (applications, interviews, offers, success rate)
* 🧩 Kanban board (drag & drop) for pipeline tracking
* 🏷️ Track application source (LinkedIn, Naukri, etc.) with custom input
* 🎨 Responsive UI with modern design

---

## 🛠️ Tech Stack

* **Frontend:** React, TailwindCSS
* **Backend:** Supabase (PostgreSQL + API)
* **Drag & Drop:** @hello-pangea/dnd
* **Icons:** lucide-react

---

## 📸 Screenshots

(Add screenshots here after deployment)

---

## 🔗 Live Demo

Once deployed on Netlify, add your live site link here:

**Live App:** https://myjob-tracker.netlify.app/

---

## ⚙️ Setup Instructions

1. Clone the repo

2. Install dependencies:

   ```bash
   npm install
   ```

3. Add environment variables:

   ```env
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```

4. Run the app:

   ```bash
   npm run dev
   ```

---

## 🌐 Deploy on Netlify

This project is ready for Netlify deployment.

1. Push your latest changes to GitHub.
2. In Netlify, choose **Add new site** → **Import an existing project**.
3. Connect your GitHub repo: `viru4/job-tracker`.
4. Netlify will use the included [netlify.toml](netlify.toml) settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in Netlify site settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy the site.

For single-page app routing, the repo already includes a redirect rule to `index.html`.

---

## 🚀 Future Improvements

* 🔔 Email reminders for follow-ups
* 🤖 AI resume matching
* 🌐 Chrome extension for auto-saving jobs

---

## 💡 Author

Built with 💻 by Virendra Kumar
