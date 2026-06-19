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