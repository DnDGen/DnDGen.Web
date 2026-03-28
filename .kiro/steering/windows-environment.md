# Windows Environment

This workspace runs on Windows (win32) with a bash shell.

## Shell Commands

Always use PowerShell-compatible commands. Never use Linux/Unix commands.

| Instead of... | Use... |
|---|---|
| `wc -l` | `(Get-Content file).Count` |
| `tail -n 10` | `Get-Content file -Tail 10` |
| `head -n 10` | `Get-Content file -TotalCount 10` |
| `cat file` | `Get-Content file` |
| `ls` | `Get-ChildItem` |
| `rm file` | `Remove-Item file` |
| `rm -rf dir` | `Remove-Item -Recurse -Force dir` |
| `cp src dst` | `Copy-Item src dst` |
| `mkdir dir` | `New-Item -ItemType Directory -Path dir` |
| `grep pattern file` | `Select-String -Pattern "pattern" -Path file` |
| `find . -name "*.ts"` | `Get-ChildItem -Recurse -Filter "*.ts"` |
| `cmd1 && cmd2` | Run commands separately, or use `;` in PowerShell |

## Key Rules

- Never use `wc`, `tail`, `head`, `grep`, `find`, `cat`, `ls`, `rm`, `cp`, or `mkdir` as bare Unix commands
- Use PowerShell cmdlets for all file and system operations
- Use `;` to chain commands, not `&&`

## Running Angular Commands (ng / npm)

The Angular app lives in `dndgen-web/`. Always use the `cwd` parameter when running `ng` or `npm` commands — never use `cd` or `&&` to change directories.

To capture output, pipe through PowerShell's `Select-Object`:

```powershell
# Run specific spec files
ng test --no-watch --include='src/app/roll/**/*.spec.ts' 2>&1 | powershell -Command "$input | Select-Object -Last 50"

# Run full suite
ng test --no-watch 2>&1 | powershell -Command "$input | Select-Object -Last 50"
```

Common mistakes to avoid:
- `cd dndgen-web && ng test` → avoid `&&` chaining; use `cd dndgen-web` then run the command separately, or use the `cwd` parameter
- `ng test ... | tail -50` → `tail` is not available, use `Select-Object -Last 50`
