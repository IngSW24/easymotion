#!/usr/bin/env node

const { execSync } = require("node:child_process");

try {
  const changedFiles = execSync("git diff --cached --name-only", {
    encoding: "utf-8",
  });

  const files = changedFiles.split("\n").filter(Boolean);

  const hasApiChanges = files.some((file) => file.startsWith("api/"));

  if (hasApiChanges) {
    console.log("\n🚨  You have changes in the API folder!");
    console.log(
      "⚠️   Don't forget to update and publish the OpenAPI schema if needed.\n"
    );
  }

  process.exit(0);
} catch (error) {
  console.error("Error checking for API changes:", error);
  process.exit(0);
}
