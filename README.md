# Blog Frontend

React + TypeScript frontend for the Blog backend. Monochromatic (dark) UI.

## Setup

```bash
npm install
```

## Run (development)

1. Start the backend on port 8080 (e.g. `mvn spring-boot:run` from the project root).
2. From `blog-frontend` run:

```bash
npm run dev
```

The app will be at http://localhost:5173. API requests are proxied to `http://localhost:8080`.

## Build

```bash
npm run build
```

Output is in `dist/`. Serve it with any static host or from the same origin as the backend.

## Features

- **Auth**: Register, login, logout (JWT).
- **Posts**: List (paginated), search, view single post. Admins can create posts.
- **Comments**: List and add comments on a post (authenticated).
- **Likes**: View count and like/unlike (authenticated).
- **Profile**: View and edit username/bio; upload/remove avatar.
- **Admin**: Dashboard with posts, users, and likes counts.

All controller endpoints from the backend are used: auth, users (me, profile, avatar), posts (list, search, get by id, create), comments, likes, admin dashboard, and file serving for avatars.
