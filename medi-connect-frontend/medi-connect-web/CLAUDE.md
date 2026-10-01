@AGENTS.md
## UI Components

- Always use shadcn/ui components built on **Base UI** for all UI in this project. Do not hand-roll components or use another UI library when a shadcn component exists for the job.
- Before using a component, check whether it is already installed (look in `components/ui/`).
- If it is not installed, install it with the shadcn CLI instead of writing it manually:
```bash
  npx shadcn@latest add <component-name>
```
- Use the installed component as-is and customize through its props and Tailwind classes, not by rewriting its source unless necessary.
