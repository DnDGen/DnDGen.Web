# Shell Command Guidelines

## Running ng test

This workspace is on Windows with bash shell. When running `ng test` or any npm script, follow these rules:

**ALWAYS use the `cwd` parameter** to set the working directory to `dndgen-web`. Never use `cd` or `&&` to change directories.

**NEVER use `tail`** - it is not available in this environment.

**To run and capture output**, pipe through PowerShell's `Select-Object` or `Out-String`:

```
# Correct pattern - use cwd parameter, pipe to powershell for output
ng test --no-watch --include='src/app/some/**/*.spec.ts' 2>&1 | powershell -Command "$input | Select-Object -Last 50"
```

**Examples:**
```
# Run specific spec files
ng test --no-watch --include='src/app/roll/**/*.spec.ts' 2>&1 | powershell -Command "$input | Select-Object -Last 50"

# Run full suite
ng test --no-watch 2>&1 | powershell -Command "$input | Select-Object -Last 50"
```

**Common mistakes to avoid:**
- `cd dndgen-web && ng test` → FAILS, use cwd parameter instead
- `ng test ... | tail -50` → FAILS, `tail` not available
- Running from workspace root without cwd → FAILS, ng not found or wrong directory
