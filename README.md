# OAUTHC Frontend

Public website and admin portal for the Obafemi Awolowo University Teaching Hospitals Complex (OAUTHC). Built with Next.js 16, React 19, and Tailwind CSS 4.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Icons**: Lucide React
- **Animations**: Framer Motion, AOS
- **Maps**: Leaflet + React-Leaflet
- **Media**: Cloudinary (next-cloudinary)
- **Real-time**: Socket.IO Client
- **Carousel**: Embla Carousel
- **Toasts**: React Hot Toast
- **Hosting**: Vercel

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm (or npm)
- Running backend API (see `oauthc-backend`)

### Install

```bash
pnpm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, set `NEXT_PUBLIC_API_BASE_URL` to your deployed backend URL (e.g. `https://your-api.onrender.com/api`).

### Run

```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start
```

---

## Project Structure

```
src/
  app/
    (public)/              # Public-facing pages (SSR/static)
      page.tsx             # Home page
      about/               # About OAUTHC
      contact/             # Contact page with form + map
      departments-centers/ # Department listings + [slug] detail
      diseases-symptoms/   # A-Z disease encyclopedia + [slug] detail
      doctors/             # Doctor directory + [slug] profile
      health-services/     # Health services + [slug] detail
      locations/           # Campus locations with map
      research-ethics/     # Research ethics application form
      schools/             # Affiliated schools + [slug] detail
      tests-procedures/    # A-Z tests encyclopedia + [slug] detail
      privacy-policy/      # Static legal page
      terms-of-service/    # Static legal page
      layout.tsx           # Public layout (header + footer)

    (admin)/
      (auth)/              # Auth pages (login, signup, forgot/reset password)
      admin/
        page.tsx           # Dashboard (role-based stats from API)
        appointments/      # Appointment management
        cms/               # CMS section pages
          announcements/
          departments/
          diseases-symptoms/
          doctors/
          health-services/
          locations/
          marquee/
          schools/
          tests-procedures/
          page.tsx          # CMS overview/index
        inbox/             # Form submission management
          contact/
          newsletter/
          research-ethics/
        profile/           # User's own profile
        users/             # User management (admin only)
        layout.tsx         # Admin layout (sidebar + header)
      layout.tsx           # Auth provider wrapper

    layout.tsx             # Root layout

  components/
    admin/                 # Admin-specific components
      AdminHeader.tsx      # Top bar with notifications bell + user menu
      AdminSidebar.tsx     # Collapsible sidebar navigation
      AuthLayout.tsx       # Centered card layout for auth pages
      ImageUpload.tsx      # Cloudinary upload widget (single/multi)

    cards/                 # Reusable listing cards
      DepartmentCard.tsx
      DoctorCard.tsx
      HealthServiceCard.tsx
      LocationCard.tsx
      SchoolCard.tsx

    layout/                # Public layout components
      footer.tsx           # Footer with newsletter subscription
      marquee.tsx          # Scrolling marquee banner (from API)
      header/              # Header components (navbar, dropdowns, mobile menu)

    sections/              # Page-specific section components
      about/               # About page sections
      contact/             # Contact form, Leaflet map
      department/          # Department detail sections
      disease/             # Disease detail sections
      doctor/              # Doctor detail sections
      health-service/      # Health service detail sections
      home/                # Home page sections (hero, welcome, departments grid, etc.)
      school/              # School detail sections
      test/                # Test detail sections

    shared/                # Cross-cutting components
      banner.tsx           # Page banners
      breadcrumb.tsx       # Breadcrumb navigation
      testimonials.tsx     # Testimonials carousel
      FilteredGrid.tsx     # Reusable filtered grid layout
      AppointmentPoster.tsx

    skeleton/              # Loading skeleton components
    ui/                    # Base UI primitives

  config/
    navigation.ts          # Navigation menu structure

  lib/
    admin-auth.tsx         # Auth context, provider, role helpers, access control
    api-client.ts          # API client with auto token refresh
    aos.ts                 # AOS animation init
    toast.ts               # Toast configuration
    diseases-data.ts       # (legacy) Static disease data
    health-services-data.ts # (legacy) Static health service data
    tests-data.ts          # (legacy) Static test data

  types/
    marquee.ts             # Marquee type definitions
```

---

## Key Architecture Decisions

### Route Groups

- `(public)` — Public-facing pages with shared header/footer layout
- `(admin)` — Admin portal wrapped in `AuthProvider`
  - `(auth)` — Login, signup, forgot/reset password (no sidebar)
  - `admin/` — Protected admin pages (sidebar + header layout)

### API Client (`lib/api-client.ts`)

Centralized fetch wrapper that handles:
- Automatic `Authorization: Bearer` header injection
- **Transparent token refresh**: on 401, automatically tries refresh token, replays the request
- **Deduplicated refresh**: concurrent 401s share a single refresh call
- **Forced logout**: dispatches `auth:logout` event when refresh fails, which the AuthProvider listens for
- Pass `{ auth: false }` for public endpoints (contact form, newsletter, etc.)

```ts
// Authenticated request
const res = await api.get<User[]>("/users");

// Public request
const res = await api.post("/contact", data, { auth: false });
```

### Auth & Access Control (`lib/admin-auth.tsx`)

- `AuthProvider` hydrates user from localStorage on mount, validates against `/auth/me`
- `useAuth()` hook provides: `user`, `login`, `signup`, `logout`, `updateUser`, `isLoading`
- `canAccess(role, feature)` checks feature-level permissions
- Three roles: `admin`, `staff`, `doctor`
- Admin layout redirects to `/login` if unauthenticated

### CMS Pattern

All CMS admin pages follow the same pattern:
1. Fetch list from `GET /admin/cms/{resource}`
2. Create/edit in a modal form
3. PATCH to update, DELETE to remove
4. Array fields (symptoms, causes, etc.) use dynamic add/remove inputs
5. Images uploaded via Cloudinary widget (`ImageUpload` component)

### Public Pages

- Listing pages fetch from public CMS endpoints
- Detail pages (`[slug]`) use server-side fetch with `revalidate: 60` for ISR
- Diseases and tests use A-Z letter navigation (all 26 letters always shown)

### Real-Time Notifications

`AdminHeader.tsx` connects to Socket.IO on mount (authenticated with JWT). Incoming `notification` events update the bell badge and dropdown in real time.

---

## Roles & What They See

| Feature | Admin | Staff | Doctor |
|---|---|---|---|
| Dashboard | Full stats (8 cards) | Subset (4 cards) | Own stats (3 cards) |
| Appointments | All + manage | All + manage | Own only |
| CMS | All sections | Most sections | None |
| Inbox | All + delete | All (no delete) | None |
| Users | Full management | None | None |
| Profile | Yes | Yes | Yes |
| Notifications | Yes | Yes | Yes |

---

## Image Uploads

The `ImageUpload` component (`components/admin/ImageUpload.tsx`) wraps Cloudinary's upload widget:
- **Single image**: returns a URL string
- **Multi image**: returns an array of URLs, with add/remove capability
- Uses unsigned upload preset (`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`)
- Supports `maxImages` prop to cap uploads
- Handles stale closure issue with `useRef` for multi-file batching

---

## Deployment

### Vercel (Frontend)

1. Connect the `oauthc-frontend` repo to Vercel
2. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_BASE_URL` = your backend URL + `/api`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
   - `NEXT_PUBLIC_SITE_URL` = your production URL
3. Deploy

### Environment-Specific Notes

- `NEXT_PUBLIC_*` variables are embedded at build time (not runtime)
- The backend URL must be set correctly before building for production
- Cloudinary upload preset must be configured as "unsigned" in the Cloudinary dashboard
