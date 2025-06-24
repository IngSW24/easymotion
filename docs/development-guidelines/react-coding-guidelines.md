# 📊 React Coding Guidelines

This document outlines specific best practices and guidelines for **React development**. It complements the [📊 Typescript Coding Guidelines](../development-guidelines/typescript-coding-guidelines.md) document, which should also be adhered to for consistency and maintainability across the codebase.

The aim of this document is to establish clear, structured, and efficient practices for React projects, ensuring high-quality code, clean architecture, and improved developer experience.

* * *

### Code Organization 🛠️

- 🔴 Organize components in **cohesive subfolders** so that all components related to a specific feature are found under the same subfolder.

Example:

```
/src
  /components
    /UI
      Button.tsx
      Modal.tsx
    /Auth
      LoginForm.tsx
      SignupForm.tsx
    /Layout
      Header.tsx
      Footer.tsx
```

- 🔴 Do not export **more than one component per file**. Additional components can be defined in the same file **only if they are specific** to the exported component.
- 🔴 Place "non-reactive" code (utilities, helper functions, etc.) in the `src/lib` folder.

Example:

```
/src
  /lib
    dates.ts      // Utility functions for dates
    validations.ts // Validation utilities
```

* * *

### Component Definition 🌐

- 🔴 Define components using the `export default function` syntax.

Example:

```
export default function Header() {
  return <header>Welcome</header>;
}
```

- 🔴 Define **component props** in the same file as the component. Export props as an **interface** with the same name as the component, suffixed with `Props`.

Example:

```
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

- 🔴 Use **interface inheritance** or generics when components share similar props structures.

* * *

### Component State Management 🔄

- 🔴 Avoid bloating components with too much state logic. If needed, move logic to a **custom hook** in a separate file named `[ComponentName].hook.tsx`.

Example:

```
/Header
  Header.tsx
  Header.hook.tsx
```

- 🔴 Extract **reusable logic** to custom hooks placed in `src/hooks`.

Example:

```
/src
  /hooks
    useAuth.tsx
    useCourses.tsx
```

- 🔴 Avoid **props drilling** by defining a React Context in the `src/context` folder and wrapping the subtree with the provider.

Example:

```
// src/context/AuthContext.tsx
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

* * *

### Side Effects 🔄

- 🔴 Ensure `useEffect` hooks are provided with a proper **dependency array**.

Example:

```
useEffect(() => {
  fetchData();
}, [fetchData]);
```

- 🔴 Use cleanup functions in `useEffect` whenever necessary.

Example:

```
useEffect(() => {
  const interval = setInterval(() => console.log("Running"), 1000);
  return () => clearInterval(interval); // Cleanup
}, []);
```

- 🔴 Use `useReducer` instead of `useState` when managing complex state.

* * *

### Error Handling ⚠️

- 🔴 Handle **recoverable error states** using `try/catch`.
- 🔴 Introduce **React Error Boundaries** to catch uncaught errors and display them gracefully.

Example:

```
export default function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) return <div>Something went wrong</div>;
  return <>{children}</>;
}
```

* * *

### Writing JSX with Material UI 🛠

- 🔴 Prefer **Material UI components** over custom styles.

Example:

```
<Button variant="contained" color="primary">Submit</Button>
```

- 🔴 Ensure `key` props in lists are **unique**.

Example:

```
users.map((user) => <div key={user.id}>{user.name}</div>);
```

- 🔴 Use **Fragments** when no HTML tag is needed.

Example:

```
<>
  <Header />
  <Footer />
</>
```

- 🔴 Ensure responsive design across viewports.

* * *

### React Query and API Communication 🌐

- 🔴 Avoid direct API calls; prefer the auto-generated API client.
- 🔴 Wrap API calls with **React Query hooks** and ensure proper revalidation.
- 🔴 Use proper **queryKey**, and invalidate queries on mutation’s onSuccess method

Example:

```
export const useCourses = () => {
  const fetchCourses = () => apiClient.get("/courses");
  return useQuery({ queryKey: ["courses"], queryFn: fetchCourses });
};
```

* * *

### React Router 🌐

- 🔴 Prefer Link component over navigate() method

Example:

```
import {Link} from "react-router";
import {Button} from "@mui/material";

export default function NavBar() {
  return (
    <>
      <Link to="/login">Login</Link>
      <Button component={Link} to="/logout">Logout</button>
    </>
  );
};
```

* * *

### Security Considerations ⚠️

- 🔴 Sanitize any code passed to `dangerouslySetInnerHTML` to prevent XSS attacks.

* * *

### Avoid Anti-Patterns 🧰

- 🔴 Do not manipulate the **real DOM** directly.
- 🔴 Avoid libraries that manipulate the DOM; prefer React-compatible plugins.

* * *

### Performance Considerations 🏆

- 🔴 Evaluate the usage of **memo**, **useMemo**, and **useCallback**, especially in contexts that wrap large subtrees or components that re-render frequently.
- 🔴 Consider using **dynamic imports** to load components **dynamically** and reduce bundle size.

* * *

By following these guidelines, the team can maintain high-quality React code, ensure scalability, and deliver better performance and user experience.