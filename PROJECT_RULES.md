# PROJECT_RULES.md

This file is the source of truth for CoChef Mobile's architecture. **Any AI
tool (or human) modifying this project must read this file first.** It exists
to keep the codebase consistent when multiple tools/sessions touch it over
time — inconsistency compounds fast in a mobile codebase, and is expensive to
unwind later.

---

## 1. Project overview

- **App**: CoChef Mobile — cafeteria ordering app for Startup Village employees
- **Expo SDK**: 54 (pinned — see rule 9, don't bump without approval)
- **React Native**: 0.81
- **Language**: TypeScript (strict mode)
- **Styling**: NativeWind (Tailwind for React Native)
- **Navigation**: React Navigation (native-stack + bottom-tabs)
- **Server state**: TanStack Query
- **HTTP client**: Axios
- **Auth token storage**: Expo Secure Store
- **Forms**: React Hook Form + Zod
- **No Redux. No Zustand. No Expo Router.**

---

## 2. Folder architecture

```
src/
 ├── assets/
 ├── components/
 │    ├── ui/
 │    └── common/
 ├── constants/
 ├── contexts/
 ├── hooks/
 ├── navigation/
 ├── screens/
 │    ├── auth/
 │    └── villager/
 ├── services/
 ├── types/
 └── utils/
```

### `services/`
All external communication and integrations — not just HTTP. One file per
resource today: `api.ts` (shared Axios instance — JWT injection, 401
handling), `auth.api.ts`, `meals.api.ts`, `orders.api.ts`,
`favorites.api.ts`. `queryClient.ts` holds the shared TanStack Query client
config. Every resource file imports `api` from `./api`, never creates its
own Axios instance.

This folder is intentionally not limited to backend calls — push
notifications, analytics, or any other external integration added later
also goes here (e.g. a future `notifications.ts`), rather than spawning a
separate top-level folder per integration.

### `assets/`
Static files only: `fonts/`, `images/`. No code.

### `components/ui/`
Atomic, reusable, **no business logic, no domain data types in props**.
Should work in any app, not just CoChef. Examples: `Button`, `Input`, `Card`,
`Loader`, `EmptyState`, `SpeechBubble`.

Test: if you stripped out CoChef entirely and reused this component in a
different app unchanged, it belongs here.

### `components/common/`
Business/domain components — reusable across screens, but coupled to CoChef's
domain types (`Meal`, `Order`, etc.) or brand identity. Examples: `MealCard`,
`Header`, `Logo`, `Mascot`, `Tag`.

Test: if the component imports a type from `src/types/` or renders
CoChef-specific content (the logo, the mascot, a nutrition tag), it belongs
here, not in `ui/`.

### `constants/`
Design tokens and static config, no logic beyond simple lookups/maps.
- `colors.ts` — brand colors (mirrors `tailwind.config.js`)
- `spacing.ts` — numeric spacing scale for non-className contexts
- `typography.ts` — font family/size/line-height tokens
- `theme.ts` — aggregates the three above
- `queryKeys.ts` — TanStack Query cache key factory

### `contexts/`
React Context + Provider for state shared across the whole app (not
server state — that's TanStack Query's job). Currently: `AuthContext`,
`CartContext`. A new context goes here, not in `hooks/`.

### `hooks/`
Custom hooks that DON'T define a Context/Provider. Includes the TanStack
Query hooks that wrap `services/` calls (`useMeals`, `useOrders`,
`useFavorites`) and any other reusable stateful logic (`useAppFonts`).

Rule of thumb: exports a Provider component → `contexts/`. Exports only a
hook function → `hooks/`.

### `navigation/`
`RootNavigator.tsx`, `MainTabNavigator.tsx`, `types.ts` (the
`RootStackParamList`/`MainTabParamList` typing + the global
`ReactNavigation.RootParamList` augmentation). No screen content here —
navigators wire screens together, they don't render app UI themselves.

### `screens/`
One file per screen, split into two subfolders by pre/post-authentication:
- `screens/auth/` — reachable before login: `SplashScreen`, `LoginScreen`,
  `RegisterScreen`.
- `screens/villager/` — reachable once authenticated: `HomeScreen`,
  `MenuScreen`, `CartScreen`, `FavoritesScreen`, `OrdersScreen`,
  `ProfileScreen`, `MealDetailScreen`, `OrderDetailScreen`.

Screens **compose** components and hooks — see rule 3.

### `types/`
Shared TypeScript interfaces for domain data (`Meal`, `Order`, `User`, etc.)
and their API payloads. If a type is used by more than one file, it belongs
here, not inlined in a component or screen.

### `utils/`
Framework-agnostic helper functions with no React and no domain coupling:
`secureStorage.ts` (SecureStore wrapper), `authSchemas.ts` (Zod schemas).

---

## 3. Component rules

**`components/ui/`** — atomic, reusable, no business logic:
`Button`, `Input`, `Card`, `Loader`, `EmptyState`, `SpeechBubble`.

**`components/common/`** — business/reusable, domain-coupled:
`MealCard`, `Header`, `Logo`, `Mascot`, `Tag`.

**`screens/`** — split into `screens/auth/` (pre-login: Splash, Login,
Register) and `screens/villager/` (post-login: everything else). Only
compose components and hooks. No complex business logic inline in a screen
file:
- Data fetching → a hook from `hooks/`, never a direct `services/` import
- Presentation → components from `components/ui/` or `components/common/`
- A screen file should read like: fetch data via a hook, handle
  loading/empty/error, map data into existing components. If a screen needs
  a non-trivial calculation (filtering, totals, formatting) that's reused
  or getting long, extract it — to `utils/` if pure, or a hook if it needs
  state.

If you're about to write more than a few lines of business logic directly
in a screen, stop and ask whether it belongs in a hook or `utils/` instead.

---

## 4. Data fetching rules

**All API calls live in `services/`. Full stop.**

- No `axios` import outside `services/`.
- No `fetch` calls in components or screens.
- Screens and components call a **hook** (`useMeals()`, `useCreateOrder()`,
  etc.) from `hooks/`, which internally calls a function from `services/` via
  TanStack Query. Never skip the hook layer and call `services/` directly
  from a screen — that bypasses caching/invalidation and duplicates
  loading-state logic per screen.

---

## 5. State management rules

- **Auth state** → `contexts/AuthContext` (`user`, `isAuthenticated`,
  `isBooting`, `login`/`register`/`logout`)
- **Cart state** → `contexts/CartContext` (`items`, `addItem`,
  `updateQuantity`, `removeItem`, `clear`)
- **Server state** (anything that comes from the backend: meals, orders,
  favorites) → TanStack Query via the hooks in `hooks/`. Never duplicate
  server data into a Context or local `useState` — read it from the query
  hook where it's needed.
- **No Redux. No Zustand.** If a future need seems to require them, that's a
  discussion to have explicitly — don't introduce either silently.

---

## 6. Navigation rules

- React Navigation only (native-stack + bottom-tabs).
- **No Expo Router.** No `app/` directory, no `_layout.tsx`, no
  `expo-router/entry` in `package.json`.
- Entry point stays `App.tsx`.
- All route names and params are typed in `navigation/types.ts`
  (`RootStackParamList`, `MainTabParamList`). Adding a screen means adding
  it there first, not inferring params ad hoc at the call site.

---

## 7. Styling rules

- NativeWind (`className`) for all styling. Avoid inline `style={{...}}`
  except where NativeWind genuinely can't reach (dynamic numeric values,
  third-party components that don't accept `className`).
- Theme values come from `constants/` — `theme.ts`, `colors.ts`,
  `spacing.ts`, `typography.ts` — not hardcoded hex/px values in components.
  Two exceptions where hardcoding is unavoidable:
  - Tailwind utility classes in `className` strings necessarily encode the
    color/spacing value as a class name (e.g. `bg-primary`) — that's fine,
    the token still lives in `tailwind.config.js`, which itself mirrors
    `constants/colors.ts`.
  - Native props that take a raw color (icon `color=`, `ActivityIndicator`,
    `tabBarActiveTintColor`) must import from `constants/colors.ts`, never
    a raw hex.
- `tailwind.config.js` and `constants/colors.ts` must be kept in sync
  manually — the config file can't import the TS file (it runs as plain
  CommonJS outside the app bundle). If you change one, change the other.

---

## 8. TypeScript rules

- **No `any`.** Use `unknown` + narrowing, or a proper interface, instead.
- Every API response has an interface in `types/`. A `services`/`api`
  function's return type is never left as an inferred blob — annotate the
  Axios generic (`api.get<Meal[]>(...)`) so the return type is explicit.
- Strict mode stays on (`tsconfig.json` — don't loosen it to unblock a
  quick fix).

---

## 9. AI modification rules

Before creating any new file:
1. **Check existing architecture** — read this file and look at the
   existing folder before assuming where something goes.
2. **Reuse existing components** — check `components/ui/` and
   `components/common/` before writing a new Button/Card/etc. variant.
3. **Don't rename folders.** If the structure in section 2 seems wrong for
   a new need, propose the change and get it confirmed before renaming —
   don't rename `services/` to `api/`, don't flatten `components/` back
   out, don't merge `screens/auth` and `screens/villager` back together.
4. **Don't introduce new libraries without approval** — especially state
   management (Redux/Zustand), navigation (Expo Router), or anything that
   duplicates something already in the stack (a second HTTP client, a
   second forms library, a second icon set alongside `@expo/vector-icons`).
5. If a real architectural gap is found (e.g. a needed screen or context
   doesn't fit any existing folder), say so explicitly rather than
   improvising a new top-level folder silently.
