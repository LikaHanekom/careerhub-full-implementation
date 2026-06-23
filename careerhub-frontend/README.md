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