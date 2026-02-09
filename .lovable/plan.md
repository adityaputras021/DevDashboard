

# 🖥️ Modern Personal Developer Dashboard

A dark-first, minimal developer dashboard website with sidebar navigation, admin CRUD capabilities, and real-time GitHub stats — built with React, Vite, TypeScript, TailwindCSS, shadcn/ui, and Supabase.

---

## 🎨 Design Direction
- **Dark-first minimal** aesthetic inspired by GitHub/Linear
- Clean lines, subtle borders, muted accents
- Light mode toggle available
- Monospace/code-style typography accents for a developer feel

---

## 📐 Layout & Navigation

### Sidebar
- Fixed left sidebar with collapsible toggle (mini icon mode when collapsed)
- Menu items: **Profile**, **Progress**, **Projects**, **Settings** (admin only, hidden when not logged in)
- Active route highlighting
- Dark/light mode toggle in the sidebar footer

### Main Content Area
- Scrollable content panel to the right of the sidebar
- Responsive: sidebar collapses to mini-mode on smaller screens

---

## 📄 Pages & Features

### 1. Profile Page (`/`)
- Hero section with profile photo, full name, and role title (e.g. "C# Developer / Backend Developer")
- Short bio paragraph
- Tech stack displayed as styled badges/chips
- All content pulled from the database, editable via admin panel

### 2. Progress Page (`/progress`)
- **GitHub Stats section**: Live stats via GitHub API (repos, stars, followers) + embedded GitHub Readme Stats SVG cards (contributions, top languages)
- **Learning Profiles**: Links to roadmap.sh and W3Schools profiles
- **Social Links**: LinkedIn, Instagram, GitHub, and other configurable social media links with icons
- All links and the GitHub username are editable via admin

### 3. Projects Page (`/projects`)
- Grid/card layout showing all projects
- Each project card: thumbnail image, title, description preview, tech stack tags, GitHub link, and optional live demo link
- **Filter by tech stack** tag
- **Pagination** for scalability
- All projects managed via admin CRUD

### 4. Admin Settings Page (`/settings`) — Protected
- Only accessible after login
- **Profile Editor**: Edit name, role, bio, tech stack; upload/change profile photo
- **Social Links Editor**: Add/edit/remove social media and profile links
- **Projects CRUD**: Create, edit, and delete projects; upload thumbnail images
- Form validation on all inputs
- Protected route — redirects to login if unauthenticated

### 5. Auth Page (`/auth`)
- Simple email/password login form (admin only — single user)
- No public signup (admin account seeded in the database)
- Redirects to Settings after login
- Logout button in sidebar when authenticated

---

## 🗄️ Database (Supabase)

### Tables
- **profiles** — name, role, bio, avatar URL, tech stack (array)
- **projects** — title, description, tech stack tags, GitHub URL, demo URL, thumbnail URL, display order
- **social_links** — platform name, URL, icon identifier, display order
- **user_roles** — links auth user to admin role (secure role-based access)

### Storage Buckets
- **avatars** — for profile photo uploads
- **project-thumbnails** — for project thumbnail images

### Security
- Row-Level Security (RLS) on all tables
- Public read access for profiles, projects, and social links
- Admin-only write access using a secure `has_role()` helper function
- Roles stored in a separate `user_roles` table (never on the profile)

---

## 🔐 Authentication Flow
1. Admin navigates to `/auth` and logs in with email/password via Supabase Auth
2. Session persisted; sidebar shows "Settings" link
3. Admin can access `/settings` to manage all content
4. Logout clears session and hides admin-only UI
5. All visitors (non-authenticated) can view Profile, Progress, and Projects pages freely

---

## 🌐 GitHub Integration
- An edge function fetches live GitHub stats (repos, stars, commits, followers) using the GitHub public API based on the stored GitHub username
- GitHub Readme Stats SVG cards embedded for visual contribution graphs and language breakdowns
- Stats refresh on page load

---

## ⚙️ Non-Functional Requirements
- Loading skeletons on all data-fetching pages
- Empty states with helpful messages
- Toast notifications for admin actions (save, delete, error)
- Error boundaries and graceful error handling
- Reusable components (ProjectCard, SocialLinkItem, TechBadge, StatCard)
- Clean file organization with clear separation of concerns

