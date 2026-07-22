# 🚀 Shahariar Sabbir - Personal Portfolio & Journey Tracker

Welcome to my digital garden! 🌱

## 📖 About This Project
I am currently an HSC candidate (Batch 2026) at REBMSC College, Rajshahi. I built this portfolio to document my 4-year journey from a high school student to a future Software Engineer. 

Instead of waiting until university graduation to create a portfolio, I decided to build in public from Day 1. This platform serves as a living document of my academic progress, university admission preparation, coding projects, and personal experiences.

## ✨ Features
* **🎓 Career & Education:** Tracking my academic milestones, starting from my SSC in 2024 and ongoing HSC.
* **📓 Digital Journal & Blog:** Documenting daily learnings, exam experiences, and personal thoughts.
* **💻 Projects:** Showcasing web applications and coding experiments as my skills grow.
* **🛠️ Skills:** A real-time timeline of the technical and soft skills I am acquiring.
* **🎯 Manifesto:** My personal goals, continuous learning mindset, and vision for the next four years.

## ⚙️ Tech Stack
This project was architected and deployed utilizing modern web technologies and AI coding agents:
* **Frontend:** React 19, Vite, Tailwind CSS
* **Backend & Hosting:** Firebase Hosting
* **Development Tools:** AI Prompt Engineering

## 💡 The Learning Outcome
As a beginner, I leveraged AI tools to architect and deploy this application in just two days. This project gave me firsthand experience with modern deployment pipelines, cloud hosting, and frontend development structures. It stands as my very first step into the world of computer science and a tracker for everything I will achieve next.

## 📝 Admin & Content Management Guidelines

The website features a fully functional, secure Admin Dashboard built with Firebase. Instead of hardcoding content in the source files, you should use the Admin Dashboard to manage your data dynamically.

### How to access the Admin Panel:
1. Navigate to the `/admin` route on your live/local site.
2. Sign in with your authorized Firebase credentials.

### Guidelines for Posting:
* **Blogs & Journals:** Use the Admin Dashboard to draft and publish your entries. Both support rich text/markdown. Ensure your slugs are URL-friendly (e.g., `my-first-post`).
* **Projects:** When adding a new project, upload or link high-quality screenshots and categorize them accurately (e.g., Frontend, Fullstack).
* **Skills:** The Skills section uses SimpleIcons for logos. When adding a skill, enter the exact slug from [SimpleIcons.org](https://simpleicons.org/) (e.g., `react`, `nodedotjs`) for the logo to appear perfectly.
* **Manifesto:** You can easily append or edit paragraphs for your manifesto in the admin settings. Changes reflect instantly on the frontend.
* **Atomic Saves:** The dashboard includes an "Unsaved Changes" guard and uses Firebase Batch Writes to ensure your data stays consistent, even if your connection drops mid-save!
