/// <reference types="vite/client" />

// provides a safe way to describe union types of string literals
// such as "a" | "b" | "c" | "d" by defining a list of objects
/// containing both the value and a human-readable label for each option.
type LiteralUnionDescriptor<T extends string> = {
  value: T;
  label: string;
}[];
