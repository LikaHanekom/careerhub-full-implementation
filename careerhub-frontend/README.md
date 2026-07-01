[![Frontend Tests](https://github.com/LikaHanekom/careerhub-full-implementation/actions/workflows/test.yml/badge.svg)](https://github.com/LikaHanekom/careerhub-full-implementation/actions/workflows/test.yml)
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Assignment 1.1 : CareerHub Frontend#
## Question 1 ##
Lifting State Up — The Architectural Argument
If JobList owns the selectedId, the Home page (the parent) is effectively blind to which job is selected. If the summary panel lives in Home, it cannot access selectedId. To fix this, you would have to "reach down" into the child, which violates the unidirectional data flow.

State should live at the lowest component level that needs the data. Because both the JobList (to highlight the card) and the Home panel (to display the summary) share the data, the Home component is the NCA. Moving state here ensures a single source of truth.

Data Flow: When a JobCard is clicked, it calls onSelect(id). This triggers the setSelectedId function in Home. Because the state lives in Home, React re-renders Home. This new state is then passed back down as a prop through JobList to all children. The flow is: Event (Card) -> Callback (Home) -> State Update (Home) -> Downward Prop Propagation.

## Question 2 ##
Refuting the Claim: Your colleague is technically correct about re-renders but likely confuses them with DOM mutations.

Immediate Action: After setSelectedId is called, React begins the "render phase." It calls the Home component function again to generate a new virtual DOM tree.

Why they re-render: By default, if a parent component re-renders, React recursively re-renders all children regardless of whether their individual props changed.

React 19 Compiler: The new React Compiler automatically memoizes components. It intelligently determines which components depend on which values, effectively wrapping them in memo calls so that if props haven't changed, the component function is skipped.

Re-render vs. DOM Update: A re-render is just a JavaScript function execution; it is extremely fast. A DOM update is the physical manipulation of the browser's document, which is slow. React uses the Virtual DOM "diffing" algorithm to ensure that even if a component re-renders, the actual DOM remains untouched unless the output has changed.

## Question 3 ##
Scenario A:  If you use a string, a developer could write 'Fulltime' (missing the hyphen). The compiler will not complain. When your logic tries to map 'Fulltime' to a CSS class, it will return undefined, resulting in an unstyled badge. A Union Type produces a compile-time error: Type '"Fulltime"' is not assignable to type 'EmploymentType'.

Scenario B: If the API team adds "Freelance" but the frontend isn't updated, a string variable will accept it, but your mapping logic will fail to render the badge color. With a Union Type, the TypeScript compiler will throw an error in any switch statement or lookup table that lacks a case for "Freelance", alerting the developer to update the UI logic before the code is even deployed.

## Question 4 ##
The Mechanism: In JavaScript, 0 is a falsy value. However, React treats any value returned from an expression in JSX as something to render. If the left side of && is 0, React renders the 0 to the DOM because it considers 0 a valid child node.

The Preferred Solution: Explicitly convert the value to a boolean to force React to ignore it.

Approach 1: {!!job.applicantCount && <p>... (The double-bang forces a boolean conversion).

Approach 2 (Preferred): {job.applicantCount > 0 && <p>...

 Using job.applicantCount > 0 is much more readable and semantic.
It explicitly states the business requirement ("only show if there are applicants") 
rather than relying on a type-coercion trick.

## 1. Why Static Data First ##
Static Data first decouples the backend from the frontend, isolating the frontend and firstly just focussing on the display without possibly disrupting the backend. 
data-source agnostic- means that the conponent will fucntion as intended without caring where the data is coming from. 

## 2. Type contract with the backend ##
The JobListign interface is almost like a frontend contract, describing exactly how the data will look that the UI is expecting to receive. The JobListingResponse.cs is the backend equivalent representing the same API source as the frontend contract. Should a backend developer rename an attribute in the JobListingResponse, a silent failure will occur at run time.

## 3.  Component responsibility table ##
| Component | Owns State | Receives via props |
| :--- | :--- | :--- |
| **Home** | `selectedId` | None (Top-level container) |
| **JobList** | None | `jobs`, `selectedId`, `onSelect` |
| **JobCard** | None | `job`, `isSelected`, `onSelect` |
| **SummaryPanel** | None | `selectedJob` (Derived from state)

## 4. Gate ##
PS C:\Users\TrainingCenter 4\careerhub-frontend> npm run build

> careerhub-frontend@0.1.0 build
> next build

▲ Next.js 16.2.9 (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully in 6.5s
✓ Finished TypeScript in 4.7s    
✓ Collecting page data using 5 workers in 1744ms    
✓ Generating static pages using 5 workers (4/4) in 1262ms
✓ Finalizing page optimization in 50ms    

Route (app)
┌ ○ /
└ ○ /_not-found


○  (Static)  prerendered as static content

PS C:\Users\TrainingCenter 4\careerhub-frontend> 

# Assignment 1.2 #
1. shadcn/ui is different from traditional component libraries because you own the code.
The component source lives in src/components/ui/ after installation
and you ou are responsible for it - it's your code. When shadcn/ui releases updates, you manually copy the new code or update your local files. There is also no forced migrations because you control the code. You won't face breaking changes like with MUI's variant → intent rename because you control the component code.

2. Why the cn Utility Exists
 cn combines clsx (for conditional classes) and tailwind-merge (to resolve conflicts).

Example scenario:

typescript
Wrong with template literal:// 
<div className={`bg-white ${isActive ? 'bg-blue-500' : 'bg-gray-100'}`}>
  {/* Both bg-white and bg-blue-500 apply - conflict! */}
</div>

// Correct with cn:
<div className={cn(
  'bg-white',
  isActive && 'bg-blue-500'
)}>
  {/* tailwind-merge resolves conflict, bg-blue-500 wins when active */}
</div>
CSS order in stylesheet makes string concatenation unreliable for resolving conflicts.

3. Event Handler vs useEffect for Persistence
The scenario handler can't handle: The user selects a job, then refreshes the page - the selection is lost.
UseEffect is better, it handles all selection changes regardless of source (clicks, keyboard, programmatic)
Click handler for user interaction, useEffect for side effects. Works even if selection is changed through other means.

4. Source of Truth for Dark Mode
True source: The dark class on <html> element

What isDark state does: Tracks the current mode for the toggle button's display/icon

What happens on unmount/remount: The React state resets, but localStorage and the <html> class persist the preference


# Project Implementation Details

## 1. Component Extraction Rationale
`JobStatusBadge` is extracted into a standalone component to adhere to the **Single Responsibility Principle (SRP)**. This ensures that `JobCard` focuses solely on layout and data display, while `JobStatusBadge` manages the logic for status rendering and styling.

* **Without extraction:** If the color scheme required an update, you would be forced to manually edit every instance of the badge within `JobCard` and potentially other components, leading to inconsistency and increased risk of bugs.
* **With extraction:** The color mapping is centralized in `JobStatusBadge.tsx`. Any design change is made in one place and propagates globally across the application.

## 2. The `cn` Utility
The `cn` function is a helper that combines `clsx` and `tailwind-merge` to manage class names cleanly.

* **`clsx`**: Allows for conditional class application, making it easy to toggle styles based on logic (e.g., `isSelected && "border-blue-500"`).
* **`tailwind-merge`**: Resolves Tailwind class conflicts. 
* **Failure Mode**: Without `tailwind-merge`, Tailwind classes might stack incorrectly. For example, if your base style is `p-4` and you conditionally apply `p-10`, the browser might keep both, causing the base style to take precedence. `tailwind-merge` ensures that the most specific or latest class overrides the base one, preventing layout errors like the one encountered in `JobCard` when applying conditional `isActive` styles.

## 3. Effect Responsibilities
The following table outlines the lifecycle and purpose of the `useEffect` hooks used in `page.tsx`.

| Effect | Dependency Array | Runs when |
| :--- | :--- | :--- |
| **Fetch Jobs** | `[]` | Component mounts initially. |
| **Filter/Sort** | `[jobs, filter, sort]` | Dependencies change (filters/sort criteria). |
| **Merged Effect** | `[jobs, filter, sort]` | Component mounts AND on any dependency change. |

**What breaks if merged:** Merging these effects would force the application to re-fetch data from the API every time a filter or sort option is changed. This causes unnecessary network overhead, degraded performance, and potential state synchronization issues (race conditions).

## 4. Build Output
```
PS C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\careerhub-frontend> npm run dev

> careerhub-frontend@0.1.0 dev
> next dev

▲ Next.js 16.2.9 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://172.20.144.1:3000
✓ Ready in 1575ms
```


# Assignment 1.3 #
## Question 1: Four things useQuery gives you that manual useEffect + useState + fetch doesn't ##
1. Background refetching 

If user switches tabs and returns, they'd see stale data until they manually refresh. With useEffect([]), data never updates after initial load.

2. Automatic caching and deduplication
 Multiple components fetching the same data would make separate network requests, wasting bandwidth and slowing the app.

3. Retry logic on failure

A temporary network glitch would show an error state immediately, requiring manual retry. Users would see errors unnecessarily.

4. Loading and error state management

You'd need to manually track isLoading, isError, error variables and update them in useEffect. Edge cases like race conditions could cause bugs.

## Question 2: The queryKey contract ##
TanStack Query uses the queryKey as a unique identifier for the cached data. It's like a database primary key - when you have ["jobs"], that's the "table name" and any filters become additional "column values."

Failure:

Two components sharing a key they shouldn't:

Component A fetches all jobs → uses ["jobs"]

- Component B fetches only active jobs → uses ["jobs"] (should be ["jobs", { active: true }])

Component B shows all jobs instead of just active ones because it's using Component A's cached data

Component using unique key when it should share:

- Two identical components each use their own instance key like ["jobs", componentId]

Both components make separate network requests for the same data, causing unnecessary loading delays

## Question 3: Why fetch doesn't throw on HTTP errors ##
- fetch() only rejects on network errors (DNS failure, connection refused, etc.) HTTP errors (404, 500, etc.) are still successful network requests - the server responded, just with an error status. Without the res.ok check, TanStack Query receives a Response object with ok: false. It would treat this as successful data and try to parse JSON, likely failing. User would see a cryptic error like "Unexpected token < in JSON at position 0" or nothing renders.

## Question 4: Stale-while-revalidate ##
- Default behavior (staleTime: 0):

    When user returns to tab, TanStack Query shows existing cached  data immediately

    Then triggers a background refetch

    User sees: Data appears instantly, then updates if changed

- With useEffect([]) and no background updates:

    No automatic refetch on tab focus

    User sees: Potentially outdated data forever until manual refresh

# README UPDATES -Assignment 1.3 #
1. What does TanStack Query Manage:
  - isLoading: Boolean that tracks if data is being fetched (would need useState + manual set)
  - isError: Boolean that tracks if fetch failed (would need useState + try/catch)
  - error: The error object if fetch failed (would need useState + manual set)
  - data: The fetched data (would need useState + manual set in useEffect)
  - isFetching: Background refetch status (would need useState + manual tracking)
  - refetch: Function to retry failed queries (would need custom function implementation)
  - Background refetching: on window focus, network reconnect (would need window event listeners)
  - Stale time management: Automatic cache invalidation (would need manual timer logic)
  - Query deduplication: Multiple components share one request (would need complex caching)

2. QueryKey Design Decision:
  ["jobs"] uniquely identifies the "all jobs" dataset. If filtering by location:

  - Bloemfontein: ["jobs", { location: "Bloemfontein" }]
  - CapeTown: ["jobs", { location: "CapeTown" }]

  The filter must be in the key because the cached data differs for each filter. 
  Without the filter in the key, queries would share cached data incorrectly.

3. Skeleton Design Rationale
  JobCardSkeleton matches JobCard's exact structure. This prevents 
  layout shift - when real data loads, the page doesn't jump because the skeleton 
  held the same space as the real content.

  A generic spinner would show a small rotating indicator, then the entire page 
  would need to render from empty, causing jarring layout shifts as content appears.


4. Gate
  PS C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\careerhub-frontend> 
   npm run dev

> careerhub-frontend@0.1.0 dev
> next dev

▲ Next.js 16.2.9 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.101.109:3000
- Environments: .env.local
✓ Ready in 1240ms
⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\package-lock.json as the root directory.
 To silence this warning, set `turbopack.root` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
   See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory for more information.
 Detected additional lockfiles: 
   * C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\careerhub-frontend\package-lock.json


 GET / 200 in 1028ms (next.js: 474ms, application-code: 554ms)
 GET /api/jobs 200 in 225ms (next.js: 186ms, application-code: 38ms)

 # Assignment 1.4 #
 ## Pre Coding Questions ##
 1. Why @hookform/resolvers is a separate package

    - What problem it solves: Library maintainers can update RHF or Zod independently without breaking each other. Allows RHF to support multiple validation libraries (Zod, Yup, Joi, etc.). Prevents tight coupling between RHF and any specific validation library

    - What zodResolver does at runtime: 
    Receives: A Zod schema from RHF
    Calls: schema.safeParse() on the form data
    Returns: An object with values (validated data) and errors (validation errors)

    ```
    typescript
    (schema: ZodSchema) => (values: any) => {
      const result = schema.safeParse(values);
      if (result.success) {
        return { values: result.data, errors: {} };
      }
      return { values: {}, errors: formatZodErrors(result.error) };
    }
    ```

2. The number input problem

  - Solution A - valueAsNumber: true:

    Converts the string to a number at the HTML input level

    register receives the numeric value directly

    Coercion happens in the browser before RHF gets the data

  - Solution B - z.coerce.number():

    Zod converts the string to a number during validation

    RHF still sees a string, but Zod handles the conversion

    Coercion happens in the validation layer

  - Both result in z.infer<typeof schema> being number: the coercion happens at different layers but the final type is the same.

  - Solution A will be best  to use, due to it being more explicit at the HTML level. RHF is also able to receives the correct type immediately and there is better type safety throughout the form.

3. mutate vs mutateAsync timing bug:
  mutate returns void: meaning it does not return a promise. mutateAsync returns: Promise<T> that you can await. Difference between mutate and mutateAsync:
  ```
  // The call stack:
    handleSubmit(onValid) 
      → onValid(data) 
        → mutate(data) // Returns void, doesn't await
          → isSubmitting drops to false // BEFORE the network request completes
          → mutation.isPending is still true
  ```

  ```
  // With mutateAsync:
    handleSubmit(onValid) 
      → onValid(data) 
        → await mutateAsync(data) // Returns a promise
          → isSubmitting stays true UNTIL the promise resolves
          → Network request completes
          → Promise resolves
          → isSubmitting drops to false
  ```
4. onSuccess placement

  Scenario where A and B behave differently:

  Option A (in options): Called for EVERY mutation call

  Option B (per call): Called only for that specific mutation

  Example scenario:
  If a form that's submitted multiple times, Option A's onSuccess fires every time. Option B's onSuccess fires only for that specific submission attempt.

  Which to use: Use Option A (in the useMutation options) because:

  We want to invalidate ["jobs"] and reset the form on EVERY successful submission

  Centralizes the success logic

  Ensures consistency regardless of where the mutation is called from

  ## Post Coding ReadMe Updates ##
  1. Schema Design Decisions
    For phone and LinkedIn URL fields, I use `z.union([z.literal(''), validator])` 
    with `.transform()` to handle empty strings from HTML inputs.

    - `z.string().optional()` alone fails because HTML inputs submit empty strings, 
      not `undefined`
    - `.or(z.literal(''))` accepts empty strings
    - `.transform()` converts empty strings to `undefined`
    - Final type: `string | undefined` (never `""`)

    This ensures the API never receives empty strings for optional fields.

  2. Cross-Field Refine
    The `.refine()` method validates relationships between fields:
      - First argument: Function that returns boolean - validates if condition is met
      - `path` option: Attaches error to a specific field, not the root

  Without `path`, the error would appear at the form level instead of on the 
  noticePeriodWeeks field, making it less discoverable for users.

  Field-level `.min(1)` alone can't express "only required when another field is false".

  3. Loading Flags
    `isBusy = isSubmitting || mutation.isPending`

    Timeline with `mutateAsync`:
    1. Button click → isSubmitting = true
    2. Form validation passes → submit handler runs
    3. await mutateAsync() → mutation.isPending = true
    4. Network request in flight → BOTH flags are true
    5. Request completes → mutation.isPending = false, isSubmitting = false

    With `mutateAsync`, mutation.isPending cannot outlast isSubmitting because 
    isSubmitting drops after the async function completes, which is after the mutation resolves.

  4. Gate
  > careerhub-frontend@0.1.0 dev
  > next dev

  ▲ Next.js 16.2.9 (Turbopack)
  - Local:         http://localhost:3000
  - Network:       http://192.168.101.109:3000
  - Environments: .env.local
  ✓ Ready in 2.1s
  ⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
  We detected multiple lockfiles and selected the directory of C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\package-lock.json as the root directory.
  To silence this warning, set `turbopack.root` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
    See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory for more information.
  Detected additional lockfiles: 
    * C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\careerhub-frontend\package-lock.json


  GET / 200 in 1461ms (next.js: 525ms, application-code: 936ms)
  GET / 200 in 206ms (next.js: 42ms, application-code: 163ms)


# Pre Code README updates: Assignment 2.1 #
 ## Question 1: cache: "no-store" vs Default ##

cache: "no-store" tells Next.js NOT to cache the fetch response on the server. This is a Next.js server-side cache (not browser cache or CDN cache). The cache lives in Next.js's internal data cache (on the server).

When to use default cached behavior:

- For static data that rarely changes (e.g., company info, job categories)

- For data that can be stale between revalidations

- When you want to reduce server load and improve response times

Difference from TanStack Query:

TanStack Query caches on the client (browser) and can refetch on window focus

Next.js fetch caching caches on the server - the data never reaches the browser until it's rendered

TanStack Query is about client-side data management; Next.js fetch is about server-side rendering optimization

## Question 2: The "use client" Boundary ##

"use client" marks a module boundary - it tells Next.js that this file and everything it imports should run on the client.

What the Server Component contributes:

HTML structure with data already populated

The initial HTML response sent to the browser

What the Client Component contributes:

Interactive JavaScript code (form handling, state management)

Event handlers (onClick, onSubmit)

React hooks (useState, useEffect)

What the browser receives:

Initial HTML: The Server Component's rendered output (job details, description, the form container)

JavaScript: The Client Component's bundle (ApplicationForm code with all its validation logic)

## Question 3: Why params.id is Always a String ##

URLs are fundamentally strings - "42", "a1b2c3d4", "senior-engineer" are all strings in the URL path. Next.js doesn't try to guess types because the same route could receive different formats.

For this assignment: No conversion is needed if the API accepts string GUIDs. It pass params.id directly to the fetch URL.

## Question 4: What "layout persists" Means ##

"Does not re-render" means:

The component function is NOT called again
DOM nodes are NOT destroyed and recreated
State inside the layout is preserved
Keeping layout data up to date:
Use fetch with a short revalidate time, or use next/cache with revalidateTag() to invalidate the cache when data changes.

## README Updates

### 1. The Composition Pattern in `/jobs/[id]`

#### What Happens When You Visit a Job Detail Page

When you go to a URL like `/jobs/123`, here's what happens step by step:

**Step 1: The Server Component Runs First**

The `page.tsx` file runs on the server. It:
- Calls the API to get the job data
- Waits for the response
- Renders the HTML with the job details already in it
- Creates the `<ApplicationForm />` element with the job data passed as props

**Step 2: The Server Sends HTML to the Browser**

The browser receives a complete HTML page that includes:
- The job title, company, location, description
- The status badge (open/closed)
- The "Back to jobs" link
- The form with input fields and a submit button

**Step 3: The Client Component Takes Over**

After the HTML loads, the JavaScript for `ApplicationForm` downloads. React then:
- Attaches event handlers to the form (so clicking "Submit" actually does something)
- Sets up form validation
- Manages the form state (tracking what the user types)

#### What if JavaScript is Disabled?

The user still sees:
- All job details (title, company, location, description)
- The form structure (input fields, submit button)
- All the styling and layout

But they CANNOT:
- Actually submit the form
- See validation errors if they type something wrong
- Get a success message after submitting

**Why this matters:** The page works without JavaScript, but works BETTER with it. This is called "progressive enhancement" - the page loads fast and works for everyone.

---

### 2. Why JobLinkCard Has No "use client"

#### The Simple Explanation

Think of it like a restaurant:

- **Server Component** = The menu board (shows what's available, no interaction)
- **Client Component** = The waiter (takes your order, handles interaction)

`JobLinkCard` is like a menu board - it just shows a job and a link. It doesn't need to handle any clicks or user interaction directly.

#### How `<Link>` Works Without "use client"

Here's the key point: `JobLinkCard` doesn't use any hooks directly. It just renders the `<Link>` component:

```tsx
// JobLinkCard - NO "use client"
export default function JobLinkCard({ job }) {
  return (
    <Link href={`/jobs/${job.id}`}>  // Just renders this
      <h3>{job.title}</h3>
    </Link>
  );
}

### 3. loading.tsx vs a Manual Loading State
The Old Way: Manual Loading with useQuery: 

-You load the page

-The component renders immediately (shows "Loading...")

-A fetch request goes out

-Data comes back

-The component re-renders (shows the actual content)

```
const { data, isPending } = useQuery({
  queryKey: ['jobs'],
  queryFn: fetchJobs
});

if (isPending) {
  return <div>Loading...</div>;  // Shows this first
}

return <div>{data.map(job => ...)}</div>;  // Shows this after data arrives
Problems with this approach:
```
The user sees a blank page first, then a spinner, then content
It requires JavaScript to work
The API call happens from the browser (slower)

The New Way: loading.tsx:

-The server starts fetching data
-The loading.tsx file shows immediately (server sends it)
-Data arrives on the server
-The real page content streams to the browser
-The skeleton is replaced with real content

tsx
// app/jobs/loading.tsx - shows skeleton
export default function Loading() {
  return <div className="animate-pulse">Loading...</div>;
}

// app/jobs/page.tsx - fetches data
export default async function JobsPage() {
  const jobs = await fetchJobs();  // Server fetches this
  return <div>{jobs.map(job => ...)}</div>;
}
Why it's better:

The skeleton appears IMMEDIATELY (no waiting). Content streams as it's ready. Works without JavaScript. The API call happens on the server (faster). 

// This is what Next.js does automatically
<Suspense fallback={<Loading />}>
  <JobsPage />  {/* This component fetches data */}
</Suspense>

### 4. Build Gate Results
PS C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\careerhub-frontend> npm run build

> careerhub-frontend@0.1.0 build
> next build

⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\package-lock.json as the root directory.
 To silence this warning, set `turbopack.root` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
   See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory for more information.
 Detected additional lockfiles: 
   * C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\careerhub-frontend\package-lock.json

▲ Next.js 16.2.9 (Turbopack)
- Environments: .env.local

  Creating an optimized production build ...
✓ Compiled successfully in 5.1s
✓ Finished TypeScript in 7.3s    
✓ Collecting page data using 11 workers in 2.7s    
✓ Generating static pages using 11 workers (8/8) in 1774ms
✓ Finalizing page optimization in 52ms    

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/applications
├ ƒ /api/jobs
├ ƒ /api/jobs/[id]
├ ƒ /dashboard/listings
├ ƒ /jobs
└ ƒ /jobs/[id]


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand



## Assignment 2.2 ##

## Question 1: Choosing a Cache Strategy

| Data Type | Strategy | Reason |
| :--- | :--- | :--- |
| **Jobs List** | `next: { tags: ["jobs"] }` | Job listings are largely static between employer updates. Caching reduces server load and optimizes response times. |
| **Single Job Detail** | `next: { tags: ["jobs"] }` | Consistency is key; using the same tag ensures the detail view stays synced with the list view. |
| **Application Statistics** | `cache: "no-store"` | Highly dynamic data. Since there is no clean trigger to invalidate the cache, fresh fetches are required. |

### Why both routes share the "jobs" tag:
Routes such as `/jobs/page.tsx` and `/dashboard/listings/page.tsx` both consume job data. By using a shared tag, a single call to `revalidateTag("jobs")` ensures that both views are updated simultaneously when a job status changes.

---

## Question 2: Why `revalidateTag` Works Across Routes

* **Global Storage:** The tag cache resides at the server level (in memory or file system).
* **Boundary Crossing:** All Server Components share this same global cache. When a Server Action executes, it has access to the global cache, allowing it to invalidate data across different route boundaries using the tag as the key.
* **Post-Revalidation:** Upon the first request after revalidation, the cache is clear; Next.js fetches fresh data from the source, performing this operation on the server before serving the HTML to the user.

---

## Question 3: Handling `Promise.all` Failure

When using `Promise.all`, if one function (e.g., `getApplicationStats()`) fails, the entire page will fail to render, triggering your `error.tsx` boundary.

### Recommended Approaches for Partial Data:

1.  **Try/Catch with Fallback:**
    ```tsx
    const [jobs, stats] = await Promise.all([
      getJobs(),
      getApplicationStats().catch(() => []) // Fallback to empty array
    ]);
    ```

2.  **Independent Suspense & Error Boundaries (Recommended for Production):**
    ```tsx
    <Suspense fallback={<StatsSkeleton />}>
      <ErrorBoundary fallback={<StatsError />}>
        <ApplicationsSummary />
      </ErrorBoundary>
    </Suspense>
    ```
    *Why:* This keeps the page partially functional and preserves the benefits of streaming.

---

## Question 4: Two-Boundary vs. One-Boundary

### The Benefit of Multiple Suspense Boundaries

Using two separate `Suspense` boundaries allows for granular loading. If one component is faster than the other, the user receives that part of the UI earlier.

| Time | Two-Boundary Experience | One-Boundary Experience |
| :--- | :--- | :--- |
| **T=0ms** | Page heading, both skeletons | Page heading, both skeletons |
| **T=120ms** | Real `ApplicationsSummary` visible | Both still loading (waiting for slow) |
| **T=450ms** | Real `ListingsTable` visible | Both now visible |

Wrapping multiple components in a single boundary forces the fast component to wait for the slow one, negating the primary performance benefit of React Streaming.

# Assignment 2.2 -After Coding Updates

---

## 1. Tracing the close action end to end

When the employer clicks the **“Close”** button, the interaction starts in the `CloseJobButton` Client Component in the browser. The button submits a form using `useActionState`, which triggers the `closeJobListing` Server Action instead of a traditional client-side fetch.

Once triggered, the form data (specifically the `jobId`) is sent from the browser to the Next.js server action layer, where `closeJobListing(prevState, formData)` executes on the server. The first step inside the action is validation — if the `jobId` is missing, the function immediately returns an error state without making any network request.

If valid, the Server Action performs a server-side `PATCH` request to the backend API (`/api/jobs/{id}`) with `{ status: "Closed" }`. This request is not visible in the browser DevTools because it originates from the server, not the client.

If the PATCH request succeeds, the backend updates the job inside its in-memory dataset and returns the updated job object, including the new status. The Server Action then calls `revalidateTag("jobs")`, which invalidates all cached Next.js fetches tagged with `"jobs"` across the application.

The cache invalidation happens on the Next.js server cache layer, not in the browser. This means any previously cached responses for `/jobs` or `/dashboard/listings` are marked stale.

Finally, the Server Action returns a success state containing the job title. On the client side, `useActionState` receives this response and updates the UI to show confirmation.

When a candidate later visits or refreshes `/jobs`, the page triggers a new server render. Because the `"jobs"` tag was invalidated, Next.js performs a fresh fetch to the backend API instead of serving cached data, ensuring the updated **“Closed”** status is reflected immediately.

---

## 2. Why two Suspense boundaries are better than one here

With two independent Suspense boundaries, the dashboard streams content progressively.

At around **T = 120ms**, `ApplicationsSummary` resolves first because it performs a single lightweight fetch. The user immediately sees the total applications card rendered.

At the same time, `ListingsTable` is still loading because it performs two fetches (`jobs` + stats) and must merge the results. Its skeleton remains visible while it resolves independently.

If both components were wrapped in a single Suspense boundary, the entire dashboard would wait for the slowest component (`ListingsTable`). At **T = 120ms**, the user would still see only a loading skeleton for the whole section, even though `ApplicationsSummary` is already ready. This reduces perceived performance and delays useful UI unnecessarily.

However, a single Suspense boundary would be the correct choice if both components depended on the same combined data request or if they needed to render atomically together.

---

## 3. The self-contained component trade-off

`ListingsTable` is self-contained because it fetches both jobs and stats internally using `Promise.all`. This makes it highly reusable — it can be dropped into any page without requiring the parent to manage data fetching or props.

However, this comes at a cost: if `ListingsTable` is rendered in multiple places (for example, dashboard, analytics page, and admin view), each instance will independently fetch the same data, potentially duplicating network requests and increasing server load.

The prop-driven approach avoids this duplication by centralising data fetching in the parent. This improves efficiency and ensures a single shared data source. However, it reduces flexibility and breaks down easily in a Suspense streaming model, because the parent must now wait for all data before rendering children, eliminating granular loading states.

In a system where `ListingsTable` is reused in five different places, I would still choose the self-contained approach because it prioritises modularity and compatibility with Suspense-based streaming. The trade-off in duplicated fetches is acceptable in this architecture because Next.js caching with tags significantly reduces repeated network costs.

## 4. Gate
PS C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\careerhub-frontend> npm run build

> careerhub-frontend@0.1.0 build
> next build

⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\package-lock.json as the root directory.
 To silence this warning, set `turbopack.root` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
   See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory for more information.
 Detected additional lockfiles: 
   * C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\careerhub-frontend\package-lock.json

▲ Next.js 16.2.9 (Turbopack)
- Environments: .env.local

  Creating an optimized production build ...
✓ Compiled successfully in 7.1s
✓ Finished TypeScript in 9.8s    
✓ Collecting page data using 13 workers in 2.6s    
✓ Generating static pages using 13 workers (8/8) in 1701ms
✓ Finalizing page optimization in 47ms    

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/applications
├ ƒ /api/applications/stats
├ ƒ /api/jobs
├ ƒ /api/jobs/[id]
├ ƒ /api/ping
├ ƒ /dashboard/listings
├ ƒ /jobs
└ ƒ /jobs/[id]


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

# Assignment 2.3

## 1. Route Protection & Roles

CareerHub utilizes middleware to enforce security at the edge, ensuring unauthenticated or unauthorized users are redirected before pages are rendered.

| Route | Authorized Roles | Unauthorized Behavior | Handling Logic |
| :--- | :--- | :--- | :--- |
| `/jobs` | Public (All) | N/A | Middleware |
| `/jobs/[id]` | Public (All) | N/A | Middleware |
| `/dashboard` | Employer | Redirect to `/login` or `/jobs` | Middleware |
| `/dashboard/listings`| Employer | Redirect to `/login` or `/jobs` | Middleware |
| `/login` | Guest (Anonymous)| Redirect to `/dashboard` | Middleware |

### Authorization Philosophy
*   **Why Middleware?** It serves as the single source of truth for security. Handling protection here prevents "flashes" of restricted content and avoids unnecessary database/data fetching for unauthorized requests.
*   **Authentication vs. Authorization:** Redirecting an unauthenticated user to `/login` is an **Authentication** enforcement (who are you?). Redirecting a candidate away from the `/dashboard` is an **Authorization** enforcement (what are you allowed to do?). Both are handled in middleware to ensure consistent, secure behavior across the entire routing tree.

---

## 2. Session Object Design

### Data Strategy
*   **Include:** `id`, `email`, `role`, and `name`. These are sufficient for UI personalization and RBAC (Role-Based Access Control) checks.
*   **Exclude:** Sensitive credentials (passwords), PII (home addresses), or large objects to prevent session bloat.

### The "Session Bloat" Risk
Excessive data in the JWT/Session increases the payload size. Since the JWT is stored in a cookie, exceeding size limits (typically 4KB) will break the application. Additionally, excessive data increases CPU overhead during the decryption/validation process on every request.

### The Three-Step Relay
To expose the role in the UI, the data must flow through these hooks:
1.  **`authorize`**: Authenticates credentials and returns the user object with the role.
2.  **`jwt`**: Injects the `role` into the encrypted JWT token.
3.  **`session`**: Reads the `role` from the JWT token and attaches it to the `session` object, making it available to `auth()`.

*Note: Forgetting to map the role in the `session` callback will result in the role being available in the token but hidden from the React components.*

---

## 3. Job Filters: State Management

| Filter | Tool | Justification |
| :--- | :--- | :--- |
| **Keyword Search** | `nuqs` | Synchronizes state with the URL for bookmarking and sharing. |
| **Location** | `nuqs` | Consistent UX with search; allows deep-linking to specific regions. |
| **Status Toggle** | `useState` | Localized UI preference; usually does not require shareable links. |

### Why `nuqs`?
`nuqs` enables **URL-as-state**. Unlike `useState`, which resets on page refresh, `nuqs` preserves the filter values in the query string. This allows users to share a filtered view of jobs (e.g., "Remote" + "React") with others, significantly improving the user experience.

---

## 4. Layout & Component Architecture

### Server Components & `auth()`
Calling `await auth()` in `layout.tsx` is highly performant. Next.js caches this request for the duration of the page render. It is the idiomatic way to handle identity-aware layouts without creating client-side waterfalls.

### Handling Nested Client Components
If a deeply nested Client Component requires the session:
1.  **Prefer Prop Drilling:** Pass the necessary session data from the Server Component parent.
2.  **Fallback:** Use `useSession()` from `next-auth/react` only if the component requires real-time reactivity to session changes (e.g., a "Logout" button that needs to update the UI immediately).

### `auth()` vs. `useSession()`
*   **`auth()`**: Use in **Server Components**. It is the standard for data fetching, server-side route protection, and SSR.
*   **`useSession()`**: Use in **Client Components**. It provides a reactive hook for the browser environment, allowing components to respond to changes in the authentication state (e.g., sign-in/sign-out transitions) without a full page reload.

# 3. Dashboard CloseJobButton 

The CloseJobButton is rendered unconditionally on the dashboard. No role check is needed in the component or page because middleware guarantees that only authenticated employers ever reach /dashboard/*. Any unauthenticated user is redirected to /login and any candidate is redirected to /jobs before the page renders. Trusting middleware for this is correct because the redirect happens at the edge, before any page code executes — the component is simply never served to anyone who shouldn't see it.

# Part 7
Location filter (text input vs select): A free-text input was chosen because locations in the dataset are arbitrary strings. A select would require knowing all possible values upfront.

No Zustand persist middleware: The view preference is session-level UI state — it resets on refresh intentionally. If persistence were needed, persist with storage: localStorage and key "dashboard-view" would be appropriate.

Why ListingsTable can't call useStore: It's an async Server Component. Hooks only run in the browser during React's render cycle; async Server Components execute on the server before hydration. The solution is a thin Client Component wrapper (ListingsTableWrapper) that reads from Zustand and passes values down as plain props.

#AfterCoding README updates: 

## The Role Redirect Decision

The post-login redirect destination is based on the user's role because candidates and employers have fundamentally different use cases. Candidates should immediately see job listings, while employers need to manage their listings.

The challenge was that `signIn` runs before the session exists, so the role isn't available in the Server Action. To solve this, I used `redirect: false` in the `signIn` call, then called `auth()` to get the session and determine the role before performing the redirect. This ensures the role is available at the point of redirect decision.

## Middleware vs Page-Level Guards

**Middleware Guard (Part 4):** The `/dashboard` route protection lives in middleware because it's a structural boundary. All routes under `/dashboard` should only be accessible to employers. Middleware is the right place because:
- It runs before any component code, preventing unauthorized access at the network level
- It centralizes access control for all dashboard routes
- It's more secure than page-level checks

**Page-Level Guard (Part 5):** The job detail page application form logic lives in the page component because:
- The route itself is public (everyone should see job details)
- The protection is about UI rendering, not route access
- It's a conditional UI decision based on user context

**General Principle:** Use middleware for route-level access control (who can see what pages) and page-level checks for component-level decisions (what to show on shared pages).

## Why URL State for Job Filters

I chose `nuqs` for job filters because:
1. **Shareable URLs:** Users can share filtered views via URLs
2. **Browser Navigation:** Back/forward buttons work naturally with URL state
3. **Bookmarks:** Users can bookmark filtered searches
4. **Server-side Rendering:** URL state is available on the server for initial render

The URL state buys us:
- Automatic state persistence across refreshes
- Deep linking capability
- SEO-friendly filter states

## Why Zustand Without Persist for Dashboard View

The dashboard view preference is session-level state because:
- It's a UI preference, not user data that needs to be stored
- Different browsing sessions can have different preferences
- It reduces complexity and storage overhead

If persistence was needed, I would use:
- **Storage:** `localStorage` with a key like `careerhub-dashboard-prefs`
- **Tradeoff:** localStorage is faster and works offline but is client-only and can become out of sync. A user preferences API endpoint would be more reliable across devices but requires backend infrastructure.

## The Async Server Component / Store Boundary

`ListingsTable` cannot call `useStore` because it's an async Server Component. Server Components can't use React hooks like `useStore` because they run on the server where React state doesn't exist.

**Prop-Passing Pattern:**
1. The page component (`DashboardListingsPage`) is a Client Component that reads from Zustand
2. It passes the store values as props to `ListingsTable`
3. `ListingsTable` remains a Server Component but receives data via props

This maintains the benefits of Server Components (data fetching, SEO) while still using client-side state for UI preferences.

## Stretch Goals

### Stretch A - Defence in Depth

The `ListingsTable` component includes a server-side check using `auth()` to conditionally render the `CloseJobButton`. This is defence-in-depth because:
- Primary protection: Middleware ensures only employers can access `/dashboard`
- Secondary protection: Even if `ListingsTable` were rendered elsewhere, the button wouldn't show

### Stretch B - Persistent Dashboard Preference

To implement persistence with Zustand:
1. Use `persist` middleware from `zustand/middleware`
2. Store in localStorage with key `careerhub-dashboard-prefs`
3. Handle hydration by using `useStore` with hydration state checking

The hydration mismatch occurs because `localStorage` is only available on the client. The server renders with default values, then the client hydrates with persisted values, causing a flash. This affects only persisted client-side stores, not in-memory stores, because in-memory stores have consistent initial states on both server and client.

### Build output:
PS C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\careerhub-frontend> npm run build

> careerhub-frontend@0.1.0 build
> next build

⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\package-lock.json as the root directory.
 To silence this warning, set `turbopack.root` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
   See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory for more information.
 Detected additional lockfiles: 
   * C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\careerhub-frontend\package-lock.json

▲ Next.js 16.2.9 (Turbopack)
- Environments: .env.local

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
  Creating an optimized production build ...
✓ Compiled successfully in 6.3s
✓ Finished TypeScript in 7.8s    
✓ Collecting page data using 15 workers in 2.7s    
✓ Generating static pages using 15 workers (9/9) in 1861ms
✓ Finalizing page optimization in 46ms    

Route (app)
┌ ƒ /
├ ƒ /_not-found
├ ƒ /api/applications
├ ƒ /api/applications/stats
├ ƒ /api/auth/[...nextauth]
├ ƒ /api/jobs
├ ƒ /api/jobs/[id]
├ ƒ /api/ping
├ ƒ /dashboard/listings
├ ƒ /jobs
├ ƒ /jobs/[id]
└ ƒ /login


ƒ Proxy (Middleware)

ƒ  (Dynamic)  server-rendered on demand

PS C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\careerhub-frontend> 

# Assignment 3.1
## Question 1 — Draft Persistence Strategy
Storage key structure: Use careerhub-application-${jobId}.
Scoped to the job ID because each job is a separate application. If you used a single key like careerhub-application-draft, starting a second application would silently overwrite the first draft. With per-job keys, both drafts coexist independently.
Two-device problem: localStorage is browser/device local. A draft saved on one device is invisible on another. You should note this limitation in the banner: drafts are saved locally and won't carry across devices.
When to clear the draft — every trigger:

Successful submit — the application was sent, the draft is no longer needed
User clicks "Discard draft" and confirms — explicit user intent to delete
That's it. Do not clear on Back, on navigation away, or on error

Fields safe to store in localStorage:

Full name, email, phone, cover letter, LinkedIn URL, "how did you hear" — all fine
Nothing here is a password or payment detail, so all fields can be stored


## Question 2 — Skeleton Loader Contract
Matching dimensions in practice for a job card means:

Same overall height (set a fixed min-height on the skeleton matching the real card)
Same padding/margin
Skeleton "lines" approximate real text line heights and widths
Same border radius, same card shadow/border

Filter returning 3 jobs but skeleton shows 6: The user sees 6 cards snap down to 3 — a jarring layout shift. The correct number is 6 as a fixed design choice (see Q4 in README). You can't know the result count before the fetch completes, so you pick a reasonable default that avoids showing too few (feels broken) or too many (feels deceptive).
Paired component pattern: JobCardSkeleton is the skeleton twin of JobCard. They share the same outer dimensions and structure. If you change JobCard's height or padding, you must update JobCardSkeleton to match. If they drift apart, you get layout shift on swap — which is worse than a spinner because it moves content the user may already be reading.

## Question 3 — AlertDialog vs Alternatives
ActionComponentWhyClose a job listingAlertDialogDestructive, irreversible — needs friction. Modal blocks all interaction until resolved.Discard application draftAlertDialogAlso destructive and irreversible — same reasoning.
The Server Action / portal problem: CloseJobButton uses a Server Action via useActionState. AlertDialogAction renders in a Radix portal — it lives outside the DOM tree of your form. This means type="submit" on a button inside AlertDialogContent does nothing, because there's no <form> ancestor for it to submit.
Solution sketch: Keep the Server Action but manage dialog state with useState and call the action programmatically with useTransition:
1. useState(false) controls dialog open/close
2. User clicks "Close listing" → setOpen(true)
3. AlertDialog renders with Cancel and Confirm
4. Confirm button's onClick → startTransition(() => callServerAction())
5. No type="submit" anywhere near the portal

## Question 4 — Empty State Taxonomy
Why they're different:

No jobs in DB: The system has nothing to show anyone. The user can't do anything to fix this — no action button.
Filters returned nothing: The user's own filters are hiding results that exist. The fix is in their hands — offer "Clear all filters."

Showing the same empty state for both is confusing: in the filter case, the user might think the platform has no jobs and leave.
Where the distinction happens — server-side:

Making two checks after the fetch:

Fetch with no filters — if zero results → state 1 (DB empty)
Fetch with current filters — if zero results but state 1 didn't trigger → state 2 (filters too narrow)

This is a server-side decision because it has direct DB access there, and it avoids sending unnecessary data to the client just to count it

Step 3 — Approach decision
Chosen approach: Keep the Server Action, manage dialog open state with useState, call the action via useTransition.
Why: your closeJobListing action is already wired with useActionState and revalidateTag, which gives you the loading/error/success state machine for free. Rewriting it as a client-side useMutation would duplicate that logic for no benefit. Instead, we wrap the existing formAction call in a startTransition, triggered manually from the AlertDialogAction's onClick instead of relying on type="submit".
Why type="submit" does nothing here: AlertDialogAction (and all Radix AlertDialog content) renders into a portal attached near document.body, outside the React tree of your <form>. A type="submit" button only submits the nearest ancestor <form> in the DOM — and there isn't one, since the portal content is rendered elsewhere in the DOM tree entirely. So we must call formAction programmatically instead of relying on native form submission.

Step 5: empty state taxonomy
The distinction is made server-side, in page.tsx, by running two queries: an unfiltered count (getJobsTotalCount) and the filtered result (getJobs). If the unfiltered count is zero, nothing exists in the database at all — independent of filters. If the unfiltered count is nonzero but the filtered result is empty, the user's filters are responsible. This must happen server-side because the client only ever receives the already-filtered list; it has no way to distinguish "nothing exists" from "nothing matched" without a second piece of information from the server.

# After Coding updates:
## Gate:
PS C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\careerhub-frontend> npm run build

> careerhub-frontend@0.1.0 build
> next build

⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\package-lock.json as the root directory.
 To silence this warning, set `turbopack.root` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
   See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory for more information.
 Detected additional lockfiles: 
   * C:\Users\alika\OneDrive\Documents\Alika IT\Bitcube\Career-Hub\careerhub-frontend\package-lock.json

✓ Generating static pages using 15 workers (9/9) in 1841ms
✓ Finalizing page optimization in 46ms    

Route (app)
┌ ƒ /
├ ƒ /_not-found
├ ƒ /api/applications
├ ƒ /api/applications/stats
├ ƒ /api/auth/[...nextauth]
├ ƒ /api/jobs
├ ƒ /api/jobs/[id]
├ ƒ /api/ping
├ ƒ /dashboard/listings
├ ƒ /jobs
├ ƒ /jobs/[id]
└ ƒ /login


ƒ Proxy (Middleware)

ƒ  (Dynamic)  server-rendered on demand

## Draft storage key decision
The storage key is scoped per job: careerhub-application-${jobId}. This means each job a candidate applies to gets its own independent slot in localStorage.
If a single shared key like careerhub-application-draft were used instead, a candidate applying to two different jobs in the same browser would have the second draft silently overwrite the first the moment they started typing. There would be no warning — the candidate would simply lose their first application's progress without realizing it, and likely only discover this when they returned to finish it and found the wrong job's data (or no data at all) waiting for them.
Scoping by job ID solves this directly: opening /jobs/123 and /jobs/456 in two tabs, or visiting one after the other, each maintains its own draft under its own key. Neither write touches the other.
This also surfaces a related edge case worth addressing: what happens if a job's requirements change while a draft is saved (e.g. the employer edits the listing, or it closes entirely)? Since the draft only stores form field values — not a snapshot of the job posting — a restored draft will always reflect the current job listing the candidate sees on page load, not a stale version. If the job has since closed, the wizard's existing !job.isActive check at the page level takes over and shows the "no longer accepting applications" message instead of the wizard, so a stale draft is never submitted against a closed listing. The draft itself remains in localStorage in that case (not auto-cleared), since the candidate may want to copy that text into a different application later — only an explicit submit or "Discard draft" click clears it.

## Solving AlertDialog with a Server Action
For Part 4a I kept the existing Server Action (closeJobListing) and useActionState, rather than rewriting it as a client-side useMutation. Dialog visibility is managed with a useState boolean (open), and the actual confirm action is triggered manually from AlertDialogAction's onClick handler, wrapped in useTransition.
The problem: AlertDialogContent (and everything inside it, including AlertDialogAction) is rendered by Radix into a portal attached near document.body — outside the React tree of the surrounding <form>. A button with type="submit" only submits the nearest ancestor <form> in the DOM, and because the portal places the button's actual DOM node elsewhere in the document, there is no enclosing form for it to submit to. Clicking it does nothing, even though visually it appears to be inside the form.
Why my solution works: instead of relying on native form submission, AlertDialogAction's onClick manually constructs a FormData object containing the jobId, then calls the Server Action's bound formAction function directly inside startTransition. This sidesteps the portal/form mismatch entirely — formAction doesn't need to be triggered via a real <form> submit event, since useActionState exposes it as a plain callable function. useTransition gives the same pending-state UX a real form submission would (the button can show "Closing…" and disable itself), without needing a literal form element to wrap the dialog content.
I chose this over the client-mutation approach because the Server Action already had error handling, response shaping, and revalidateTag wired up correctly from Assignment 2.3 — reimplementing that as a useMutation would have duplicated logic for no functional benefit.

## The Back button and validation
The Back button intentionally does not re-validate the step the user is leaving. It simply moves step back by one, with no trigger() call.
The reasoning: validation should only ever block forward progress, not backward navigation. A user moving backward is, by definition, not trying to submit anything yet — they're reviewing or correcting something. If Back triggered validation on the step being left, a user who clicked Back from step 2 to fix a typo in their full name (step 1) could find themselves unable to leave step 2 at all, because they hadn't yet filled in the optional cover letter or LinkedIn URL on step 2. The very act of trying to go fix an earlier mistake would be blocked by incomplete data on the step they're trying to leave — which is backwards. The user should always be free to move back and look at, or revise, any earlier step regardless of what state the current step is in.

## Skeleton count justification
Six skeleton cards were chosen because, in the page's grid-cols-1 md:grid-cols-2 lg:grid-cols-3 layout, six fills exactly two full rows on desktop without scrolling — enough to suggest a reasonably populated page without committing to a specific number of real results.
Showing too few (e.g. 2–3 cards) sends the signal that there's barely any content on the page before the data has even loaded, which can make the page feel sparse or broken even if the real result count turns out to be large. Showing too many (e.g. 12+) creates the opposite problem: it implies a large result set is coming, and if the actual filtered results are much smaller, the swap from skeleton to real content causes a jarring collapse in apparent content volume — closer to a bait-and-switch than a loading state. Six is a middle ground that reads as "a normal page of jobs is loading" without over- or under-promising.

## Empty state taxonomy
/jobs can be empty for two distinct reasons, and the distinction is made server-side, inside app/jobs/page.tsx.
The page runs two queries in parallel: getJobs(filters), which returns the filtered result set, and getJobsTotalCount(), which returns the count of all jobs in the database with no filters applied. Comparing the two determines which empty state applies:

If totalCount === 0, the database itself has no jobs at all — independent of any filters the user has applied. This renders "No jobs are currently listed," with no action button, since there's nothing the user can do to fix an empty database.
If totalCount > 0 but the filtered jobs array is empty, the user's filters are responsible for the empty result. This renders "No jobs match your search," along with a summary of the active filters and a "Clear all filters" link.

This has to happen server-side because the client only ever receives the already-filtered list of jobs from the page's render — it has no independent way to know whether zero results means "the database is empty" or "the filters were too narrow" without a second data point from the server. A client-side count check would either require an extra round-trip fetch (worse for performance and adds complexity) or duplicate logic that the server already has cheap, cache-tagged access to.

# Assignment 3.2
## Question 1 — What is worth testing?
Category A — High-value behaviours to test

Step validation blocks advancement (the trigger() call in handleNext). A regression here means a candidate could advance to step 2 with an invalid email or missing name, and that bad data would reach your backend. High value because it directly protects data integrity at the boundary where user input enters the system.
The auth gate on step 1 (!applicantId disabling Next). A regression here means an unauthenticated user could submit an application with no applicantId, which would either crash the mutation or silently corrupt backend data. High value because it's a security/correctness boundary, not just a UX nicety.
Back button preserves field values. A regression here (e.g. accidentally calling reset() instead of just setStep) would silently destroy a candidate's typed work — exactly the kind of bug that's invisible until a real user loses their cover letter mid-application.
Review step renders "Not provided" for empty optional fields, rather than blank or undefined. A regression here means the review screen lies to the candidate about what they're about to submit.
Draft restore on mount populates the form and shows the banner. A regression here breaks the entire reason the feature exists — silent data loss on refresh.
Successful submit clears the draft and resets to step 1. A regression here means a candidate who submits, then later returns to the same job, sees a "draft restored" banner full of stale data from an application they already sent.

Each of these is high-value because it's a behaviour a real candidate would notice breaking, with a concrete bad outcome (lost data, bad submission, confusing UI) — not just a difference in rendered markup.
Category B — Things NOT worth testing

Exact Tailwind class names (e.g. asserting className contains bg-blue-600). Testing this gains nothing — it doesn't verify the button is usable, visible, or functions correctly, and it actively costs you: every time you redesign the button's color or spacing, the test breaks for a reason that has nothing to do with behavior, training you to ignore test failures.
The exact number of <div> elements rendered, or DOM structure/nesting depth. This couples the test to implementation details that could change for purely cosmetic refactors (e.g. wrapping a section in an extra div for spacing). You'd gain nothing about correctness and lose the ability to refactor markup freely without breaking unrelated tests.

Category C — Draft persistence: real vs mocked localStorage
I'd use the real jsdom localStorage implementation, not vi.spyOn.
A vi.spyOn(Storage.prototype, "setItem") mock only verifies that your code called setItem with certain arguments — it tells you the component attempted to write, but says nothing about whether a value written that way could actually be read back correctly later (e.g. JSON serialization bugs, key collisions, type mismatches on parse). Real jsdom localStorage is a working in-memory implementation of the actual Storage API, so a test using it verifies the full round trip: write on mount, persist across a simulated reload, and successfully restore via JSON.parse into the form. That's a much stronger guarantee of actual behavior, and it's what Stretch Goal A explicitly asks for too — so it's worth setting up properly now.

## Question 2 — Mocking the session
Approach 1 — vi.mock("next-auth/react", ...): Replaces the entire useSession hook with a fake function that returns whatever you tell it to ({ data: session, status: ... }). This mocks everything about authentication — there's no real SessionProvider, no real context, no real network call. It leaves nothing real; the component just receives a hardcoded session value directly from the mocked hook.
Approach 2 — wrap in a real SessionProvider with initialSession: This uses the actual NextAuth client-side provider and context machinery, just seeded with fake data instead of a real fetched session. It leaves the context plumbing real — useSession() genuinely reads from React context the way it would in production — while only the session data itself is fake.
Which I'd use for Part 3 auth-gate tests: Approach 1 (vi.mock). It's simpler, faster, and sufficient — the auth-gate tests care only about what ApplicationWizard does with a given session value (null vs an authenticated candidate vs an employer), not whether NextAuth's context propagation itself works correctly, which is NextAuth's own responsibility to test, not ours.

## Question 3- MSW Scope

| Request Method | URL Pattern | Happy-path response |
| :--- | :--- | :--- |
| **POST** | `${API}/api/v1/applications/apply` | 201 with a mock `ApplicationResponse` (id, jobId, email, submittedAt) |
| **N/A** | Revalidate jobs (Server Action) | Not an HTTP request — `revalidateJobs()` is a Next.js Server Action calling `revalidateTag` internally |

That is the only real client-initiated HTTP request `ApplicationWizard` makes — it does not fetch the job on mount (the job is passed in as props from the server-rendered parent page), and it has no other queries. Your wizard is comparatively lean here compared to the demo's `BookingWizard`.

### What MSW cannot help test
The `revalidateJobs()` call and the subsequent `router.refresh()` cannot be intercepted by MSW. These are not standard HTTP requests:
*   `revalidateJobs` is a **Next.js Server Action** that runs server-side and calls `revalidateTag`.
*   `router.refresh()` triggers Next.js's internal RSC (React Server Component) re-fetch mechanism.

In a Vitest + jsdom environment, these should be mocked directly (e.g., `vi.mock` the Server Action module, or allow it to run if it is harmless in a test context). This is a real example of where the demo pattern needs adapting: your wizard's post-submit side effects span both an HTTP boundary (MSW-testable) and a Next.js server-action boundary (not MSW-testable, requires specific mocking).

---

# Question 4 — Test naming as specification

| # | Original | Type | Rewrite / Reasoning |
| :--- | :--- | :--- | :--- |
| **a** | "ApplicationWizard currentStep state equals 'schedule' after clicking Next with valid step 1 data" | Implementation | **Rewrite:** "shows the Schedule step heading after clicking Next with valid step 1 data" (Describes what the user sees) |
| **b** | "shows Schedule heading when step 1 is complete" | Behaviour | No rewrite needed. |
| **c** | "calls localStorage.setItem with the correct key on step change" | Implementation | **Rewrite:** "the draft persists across a simulated reload after changing steps" (Asserts the outcome, not the implementation) |
| **d** | "draft is available when the user returns to the form mid-application" | Behaviour | No rewrite needed. |
| **e** | "ApplicationWizard renders 3 div elements with role='status'" | Implementation | **Rewrite:** "shows a progress indicator with three steps" (Asserts visible labels/numbers rather than DOM element counts) |


#Post Code README updates: Assignment 3.2:
1. What makes a test high-value for this codebase
I prioritized behaviours where a silent regression costs a candidate real work or lets bad data through: step validation blocking invalid advancement, the auth gate preventing unauthenticated submission, Back preserving typed values, and "Not provided" rendering for empty optional fields on review. Each maps to a concrete failure a user would actually hit.
I did not test the exact Tailwind classes on the progress indicator (e.g. bg-blue-600 vs bg-gray-200) or the precise div nesting of the step container. These would break on a purely cosmetic refactor, training the team to ignore failing tests, while proving nothing about correctness.

2. Session mocking approach
I used vi.mock("next-auth/react", ...) per the assignment's setup, but ApplicationWizard doesn't actually call useSession() — auth state is resolved server-side in the parent page and passed down as applicantId/isEmployer props. So the auth-gate tests (5 and 6) set state directly through those props rather than exercising the session mock. The mock stays in place to match the required scaffolding and would matter for any component that does call useSession() directly. It verifies that a component reading the hook gets the session value I specify — not that NextAuth's real session-fetching or cookie handling works, which isn't this suite's job.

3. The localStorage question
I used the real jsdom localStorage implementation, clearing it in beforeEach/afterEach. A vi.spyOn mock would only confirm setItem was called with certain args — not that the value could actually be read back and parsed into the form. Real localStorage verifies the full write → reload → restore cycle, which is the actual feature being tested.
This proves the round trip works within one test run and that key scoping (careerhub-application-${jobId}) behaves correctly. It can't prove real browser quirks — storage quotas, private browsing, or persistence across an actual reload — since jsdom's localStorage only lives in memory for the test.

4. One test that surprised you
Test 8 kept failing with the wizard apparently stuck on step 1, and I assumed fillAllSteps was broken. An isolated debug version of the same logic passed fine, which ruled that out.
The real issue: after a successful submit, the wizard resets to step 1 — so the "Submit Application" button (step 3 only) correctly disappears. My test was waiting for that button to reappear as a "submission settled" signal, but it was never coming back by design. The fix was waiting for the step 1 heading instead, which both confirms the async reset completed and directly checks the real outcome. The failure wasn't a bug — it was my test describing the wrong experience.

# Assignment-3.3: Part 1
## Part 1 - Written Decisions

### Question 1 - Image Audit

#### Image Locations Found:

1. **Home page hero/banner** (if present)
   - Source: `/public/hero-image.png` (local file)
   - Above the fold: Yes
   - next/image candidate: Yes, this is the LCP candidate
   - Priority: HIGHEST - This is the largest contentful paint element

2. **Company logos on job listing cards**
   - Source: Remote URL from API (e.g., `https://company-logos.s3.amazonaws.com/logo.png`)
   - Above the fold: No (user must scroll)
   - next/image candidate: Yes
   - Priority: None (lazy loaded)

3. **Employer profile images**
   - Source: Remote URL from API
   - Above the fold: No
   - next/image candidate: Yes
   - Priority: None

4. **Static illustrations/decorative images**
   - Source: `/public/illustration.svg`
   - Above the fold: Varies
   - next/image candidate: No (SVG icons handled inline)

**Highest Priority Image:** Home page hero/banner image
- **Justification:** This image is the most likely LCP candidate as it's the largest visible element above the fold. Optimizing this with priority prop ensures it loads early, improving LCP scores.

### Question 2 - ApplicationWizard Loading Decision

**a. Does it make sense to set ssr: false on ApplicationWizard?**

Yes. Setting `ssr: false` makes sense because:
- The wizard requires client-side state (useSession, localStorage)
- It depends on browser APIs that aren't available during SSR
- The wizard is below the fold and not visible to unauthenticated users

**What breaks if you set ssr: true?**
- `useSession()` would throw an error because session state isn't available on the server
- `localStorage` access would fail during SSR
- Components like `AlertDialog` that depend on browser APIs would break

**b. Does loading ApplicationWizard's JavaScript eagerly harm unauthenticated users?**

Yes, it harms them because:
- They download JavaScript they'll never use
- It increases the bundle size unnecessarily
- It affects TTI (Time to Interactive) and FCP metrics
- It wastes bandwidth on mobile connections

**c. Why do tests remain unaffected by dynamic import?**

The tests import the component directly from its source file:
```typescript
import { ApplicationWizard } from '@/components/ApplicationWizard';

### Question 3 - Static vs Dynamic Metadata
a. Home page (/)

Approach: Static metadata export
Why: Content is static and doesn't change per request. No API data needed.

b. Job listings page (/jobs)

Approach: Static metadata export
Why: Listing page metadata is consistent regardless of search parameters. It doesn't depend on dynamic data.

c. Job detail page (/jobs/[id])

Approach: generateMetadata (dynamic)
Why: Content depends on the specific job ID from the API. Titles and descriptions must match the job being viewed.

Deduplication Question:

Next.js deduplicates identical fetch requests when:
Both generateMetadata and the page component call the same function
The function is called with the same parameters
The fetch is done with the same cache configuration
The condition that must hold: The data-fetching function must be called before the page component renders. Next.js caches the promise and reuses it.

What breaks deduplication?
Using different fetch implementations (raw fetch vs. getJob)
Different cache configurations
Different parameters passed to the function
Calling functions in different request contexts

### Question 4:
Home page:
Performance Score	98	
LCP	0.6 s	Good 
CLS	0.074	Good 
INP	N/A	N/A (not available in dev)
SEO Score	100	
SEO Flags:all SEO checks passed 

JobListing:
Metric	Value	Rating
Performance Score	96	-
LCP	0.6 s	Good 
CLS	0.074	Good 
INP	N/A	N/A (not available in dev)
SEO Score	100	-
SEO Flags:None - all SEO checks passed 