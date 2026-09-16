# AGENTS.md

## Essential Commands

- **Start Development Server**: Use `npm run dev` to launch the Vite development server; typically runs on `http://localhost:5173`.
- **Build**: Run `npm run build` to perform type-checking followed by production build.
- **Preview Build**: Execute `npm run preview` to preview the production build.
- **Lint**: Use `npm run lint` to lint the codebase using ESLint.
- **Format**: Use `npm run format` to format code with Prettier.
- **Type Check**: Use `npm run typecheck` to check types without emitting outputs.

## Configuration Insights

- **Vite + React**: The project leverages the Vite setup with React and Tailwind CSS plugins. Ensure compatibility with these tools.
- **Module Resolution**: Aliasing is set with `@` to refer to the `src` directory, simplifying internal imports (e.g., `@/components/foo`).

## Important Guidelines

- **Script Order**: Follow intended script usage order for smooth operation: **Develop -> Lint/Format -> Build -> Preview**.
- **TypeScript Config**: Ensure TypeScript settings support the latest ECMAScript features and strictly handle types.
- **Environment**: Primarily operates under Node.js 20+. Ensure correct Node.js version.

## When in Doubt
- Cross-verify script and runtime behavior with the configurations laid out in `vite.config.ts` and `tsconfig.json`.
- Prefer executable config as the source of truth over any written documentation.

## Support
For unique team conventions or project-specific workflow questions, consider consulting existing team documentation or direct queries as standard protocols require.