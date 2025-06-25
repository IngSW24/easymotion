# 📊 Typescript Coding Guidelines

Welcome to the **coding best practices guide** for our development team. This document outlines the general rules and standards to maintain consistency, readability, and efficiency across our codebase. By following these guidelines, we ensure that:

1. Code is clean, well-documented, and easy to maintain.
2. Team members can collaborate effectively without confusion.
3. Development workflows remain streamlined and errors are minimized.

This section covers general TypeScript coding practices that apply to all projects. Project-specific guidelines will be added in dedicated pages.

### Linting and Formatting ✏️

- 🔴 Ensure **linting rules** are respected and disable linting warnings **only when strictly necessary**.
  - Use the **ESLint plugin** in VSCode to ensure linting rules are checked automatically.
- 🔴 Ensure code is formatted according to the **defined criteria**.
  - Use the **Prettier plugin** in VSCode to automatically apply formatting rules. This way, developers don’t need to manually think about formatting.

- ⚙️ Download the [Prettier Extension for VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- ⚙️ Download the [ESLint Extension for VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Comments 📊

- 🔴 Write code and comments in **English**. Do not mix languages.
- 🔴 Use **standard comment formatting** for functions so they can be visible through IDE tooling.

Example of a function comment:

```
/**
 * Retrieves user data from the database
 * @param userId - The unique identifier for the user
 * @returns User object with the provided userId
 * @throws Error if userId is not found
 */
async function getUserById(userId: string): Promise<User> {
  // Function logic
}
```

- 🔴 Ensure that function comments describe the **contract** of the function:
  - Types
  - Inputs and outputs
  - Descriptions with eventual side effects
- 🔴 Keep comments **up-to-date** with the actual function behavior.
- 🔴 Use comments **inside functions** only when strictly necessary. Instead, use **meaningful variable names** and split the code logically so it can **document itself**.

**Example of self-documented variable names:**

```
// Avoid: unclear variable names
const x = getData(); // retrieve the user
const y = x.filter((z) => z.status === "active"); // only get active ones

// Preferred: self-documented code. This tells the same things without comments
const allUsers = getUserData();
const activeUsers = allUsers.filter((user) => user.status === "active");
```

### Code Cleanliness 🛠️

- 🔴 **Do not keep "old" code commented out**; rely on Git for version history.
  - Delete unused or deprecated code from the codebase.
- 🔴 Always use **async/await** instead of promise chaining for better readability.
- 🔴 Avoid inline type definitions. Instead, define types separately for clarity and reusability.

Example:

```
// Inline type (Avoid)
function greet(user: { name: string; age: number }) {
  console.log(`Hello, ${user.name}`);
}

// Separate type declaration (Preferred)
type User = {
  name: string;
  age: number;
};

function greet(user: User) {
  console.log(`Hello, ${user.name}`);
}
```

### TypeScript Best Practices 🛢️

- 🔴 **Write types explicitly** only when they cannot be inferred directly by TypeScript.
- 🔴 Avoid using the `any` type. If necessary, use `unknown` and cast it to the required type.
- 🔴 Use TypeScript features effectively:
  - Interfaces
  - Type unions
  - Intersection types
  - Utility types
  - Generics

**Principle**: If something changes, it should only need to change in **one place** in the codebase.

- 🔴 Reuse types in a **types.ts** file within the same module if necessary.
  - This is especially useful when there are multiple or shared types.

Example:

```
/src
  /users
    userService.ts
    types.ts  <-- Contains User-related types
  /products
    productService.ts
    types.ts  <-- Contains Product-related types
```

### Naming Conventions 📚

- 🔴 Use **camelCase** for:
  - Variable names
  - Function names
  - File names (e.g., `myFile.ts`)
- 🔴 Use `UPPER_SNAKE_CASE` when you want to declare a final, constant variable.
- 🔴 Use **PascalCase** for:
  - Class names
  - Type, Enum and interface names
  - React component file names (e.g., `MyComponent.tsx`)
- 🔴 Prefix unused variables and function parameters with `_` if they cannot be removed.

Example:

```
function processData(_unusedParam: string, activeUsers: number[]) {
  console.log(activeUsers.length);
}
```

### Code Structure 📁

- 🔴 Organize code according to **domain-driven design** principles:
  - Place features in relevant subfolders or packages.
  - Use naming conventions relevant to the domain.

Example of folder structure:

```
/src
  /auth
    authController.ts
    authService.ts
    types.ts
  /user
    userController.ts
    userService.ts
    types.ts
```

### Variables and Constants ⚖️

- 🔴 Prefer **immutable data structures** over mutable ones.
- 🔴 Use `const` for variable declarations by default.
- 🔴 Use `let` only when the variable needs to change its value.
- 🔴 Avoid using `var`.

Example:

```
const maxUsers = 100;
let currentUsers = 0; // Mutable, only use let when necessary
```

- 🔴 Prefer **const function declarations** unless exporting a React TSX component as default or unless you need the function declaration to correctly evaluate the `this` keyword.
- 🔴 Stay **consistent** with function declarations:
  - If other functions in the module use `const`, maintain that coherence.

Example:

```
// Preferred for functions
// note that output type is not specified since it can be inferred
const calculateTotal = (a: number, b: number) => a + b;

// React Component default export
export default function MyComponent() {
  return <div>Hello World</div>;
}
```

### Strings and Objects 📏

- 🔴 Use **ES6 import syntax** for importing modules.
- 🔴 Interpolate strings using backtick syntax instead of the + operator for clarity.

Example:

```
// Avoid
const message = 'Hello, ' + user.name + '!';

// Preferred
const message = `Hello, ${user.name}!`;
```

- 🔴 Use array/object methods like `forEach`, `map`, `filter`, and `reduce` instead of loops **whenever possible** for clarity and conciseness.

Example:

```
const users = ["Alice", "Bob", "Charlie"];

// Avoid
for (let i = 0; i < users.length; i++) {
  console.log(users[i]);
}

// Preferred (less lines of code, increased readability)
users.forEach((user) => console.log(user));
```
