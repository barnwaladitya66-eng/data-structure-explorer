# StructureLab

**StructureLab** is a multi-page interactive educational site for teaching **Stack, Queue, Tree, and Graph** — built for teachers, demos, and self-study. Every structure gets its own page with a live, animated visualizer plus side-by-side reference implementations in **five languages**.

![StructureLab](public/favicon.svg)

## ✨ Features

- **Interactive visualizers** for all four core data structures:
  - **Stack** — push/pop with animated LIFO cells and overflow guard
  - **Queue** — enqueue/dequeue with front/rear pointers
  - **Tree** — insert/search through a binary search tree, animated node-by-node traversal
  - **Graph** — build an adjacency list and step through BFS/DFS traversal
- **Implementation section on every page** with tabbed code snippets in **JavaScript, Python, C, C++, and Java**, with a lightweight zero-dependency syntax highlighter (custom tokenizer in `src/lib/highlight.ts`).
- **Dark "gritted" theme** — dark navy backdrop, per-structure accent colors, grid backdrop, Framer Motion page transitions.
- **Favicon + manifest** matching the site's cyan-on-navy brand tile.

## 🗺️ Pages

| Route        | Description                                        |
| ------------ | -------------------------------------------------- |
| `/`          | Landing page with structure cards and CTAs         |
| `/stack`     | Stack visualizer + implementations                 |
| `/queue`     | Queue visualizer + implementations                 |
| `/tree`      | BST visualizer + implementations                   |
| `/graph`     | Graph visualizer + implementations                 |
| `/auth`      | Sign in / sign up (email OTP)                      |
| `/dashboard` | Protected dashboard (`RequireAuth`)                |

## 🛠️ Tech Stack

- **TypeScript** + **React 19** + **Vite**
- **Tailwind CSS v4** + **shadcn/ui** + **Lucide icons**
- **Framer Motion** for animations
- **Convex** (backend + database) and **Convex Auth**
- **react-router** v7 (`react-router`, not `react-router-dom`)
- **Bun** as the package manager

## 🚀 Getting Started

> Requires [Bun](https://bun.sh) and a [Convex](https://convex.dev) account.

```bash
# 1. Install dependencies
bun install

# 2. Push the Convex schema and generate types (one-off in a fresh checkout)
bun convex dev --once

# 3. Start the dev server
bun run dev
```

The app expects `CONVEX_DEPLOYMENT` and `VITE_CONVEX_URL` env vars (already wired for the hosted sandbox). Convex-side auth secrets (`JWKS`, `JWT_PRIVATE_KEY`, `SITE_URL`) live in the Convex dashboard.

### Typecheck

```bash
bun tsc -b --noEmit
```

## 📁 Project Structure

```
src/
├── components/
│   ├── CodeBlock.tsx       # CodeTabs — 5-language snippet switcher
│   ├── SiteLayout.tsx      # Shared header/footer + page transitions
│   └── ui/                 # shadcn/ui primitives
├── lib/
│   ├── structures.ts       # Structure metadata + all 20 code snippets
│   └── highlight.ts        # Zero-dependency syntax tokenizer (js/py/c/cpp/java)
├── pages/                  # Home, Stack, Queue, Tree, Graph, Auth, Dashboard
├── hooks/
└── convex/                 # Convex schema, auth, queries
```

## 🤝 Contributing

Ideas welcome: new structures (heap, trie, hash table), more traversal modes, or additional languages in the implementation tabs.

---

Made by **ADITYA** 💙
