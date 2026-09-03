# 🎨 CanIA - AI-Powered Canvas Graphic Design Platform

[![Next.js 14](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fabric.js](https://img.shields.io/badge/Fabric.js-Canvas-FF5722?style=for-the-badge&logo=javascript&logoColor=white)](http://fabricjs.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-PostgreSQL-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)

**CanIA** is a web-based graphic design editor inspired by Canva. Built with **Next.js 14**, **Fabric.js**, **Hono**, **Drizzle ORM**, **Neon Postgres**, and **Replicate AI API**, it provides an intuitive canvas workspace paired with generative AI image creation and editing tools.

---

## ✨ Features

- 🖌️ **Interactive HTML5 Canvas**: Powered by **Fabric.js** — draw shapes, insert text, manipulate layers, scale, rotate, align guides, and customize colors.
- 🧠 **Agentic AI Design Assistant**: Describe what you want in plain language (e.g. "create a banner with a blue title and a decorative circle") and a **Claude**-powered agent plans and executes the multi-step canvas edits for you — adding text/shapes, generating images, aligning, restyling and re-ordering elements — with a live step-by-step log of what it's doing.
- 🤖 **AI Image Generation & Tools**: Seamless integration with **Replicate API** to generate AI images, remove backgrounds, upscale assets, and inpaint elements.
- 🖼️ **Unsplash Stock Engine**: Browse and insert high-res photography directly onto the canvas workspace.
- 💾 **Real-Time Project State**: Save, load, export (PNG, JPG, SVG, JSON canvas states), and manage user project templates.
- ⚡ **Hono API Sub-routing**: Fast RPC endpoints integrated with `@tanstack/react-query` for real-time reactivity.
- 🗄️ **Database & Auth**: Type-safe schema with **Drizzle ORM**, hosted on **Neon PostgreSQL**, authenticated via **Auth.js / NextAuth v5**.
- 💳 **Stripe Billing Integration**: Subscription plans and usage credit management.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) + [Hono](https://hono.dev/) |
| **Canvas Engine** | [Fabric.js](http://fabricjs.com/) (HTML5 Canvas Object Model) |
| **Database & ORM** | [Neon PostgreSQL](https://neon.tech/) + [Drizzle ORM](https://orm.drizzle.team/) |
| **AI Integration** | [Replicate API](https://replicate.com/) (Stable Diffusion, BG Removal) + [Anthropic Claude](https://www.anthropic.com/) (Agentic design assistant) |
| **State & Fetching** | [Zustand](https://zustand-demo.pmnd.rs/) + [TanStack React Query](https://tanstack.com/query) |
| **Authentication** | [NextAuth.js v5](https://authjs.dev/) |
| **Payments & Assets** | [Stripe API](https://stripe.com/) + [UploadThing](https://uploadthing.com/) + [Unsplash API](https://unsplash.com/developers) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.17` or higher (or [Bun](https://bun.sh/))
- **PostgreSQL Database**: A [Neon](https://neon.tech/) database instance

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Devmustroc/canIA.git
   cd canIA
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or with bun
   bun install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@ep-sample.neon.tech/cania?sslmode=require
   AUTH_SECRET=your_auth_secret
   REPLICATE_API_TOKEN=your_replicate_token
   UNSPLASH_ACCESS_KEY=your_unsplash_key
   STRIPE_API_KEY=your_stripe_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
   See `.env.example` for the full list of variables (including optional OAuth and UploadThing keys).

4. **Run database migrations**:
   ```bash
   npx drizzle-kit migrate
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
canIA/
├── app/                  # Next.js 14 App Router routes & page layouts
│   ├── api/[[...route]]/ # Hono API server integration
│   └── editor/[projectId]/# Main Canvas Editor interface
├── features/             # Feature-sliced modules (editor, ai, auth, projects)
├── db/                   # Drizzle schema definitions & database setup
├── hooks/                # Custom React hooks (canvas events, hotkeys, state)
├── lib/                  # Utilities, fabric helpers & replicate client
└── public/               # Static assets & canvas templates
```

---

<p align="center">
  Crafted with ❤️ by <a href="https://github.com/Devmustroc">Devmustroc</a>
</p>
