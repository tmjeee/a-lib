# a-lib Workspace

This is an Angular workspace containing the `a-lib` library (published as `@tmjeee/a-lib`).

It was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.0 with `--create-application=false` followed by `ng generate library a-lib`.

The library is built using **ng-packagr** (via `@angular/build:ng-packagr`).

## Library Project

- Source: `projects/a-lib/`
- Build output: `dist/a-lib/`
- Public API: `projects/a-lib/src/public-api.ts`

## Useful npm scripts

```bash
# Build the library (uses ng-packagr)
npm run build:lib

# Watch mode for the library
npm run build:lib:watch

# Run library unit tests (vitest) - stops after running by default
npm run test:lib

# Watch mode for tests (re-runs on changes)
npm run test:lib:watch

# Pack the built library tarball (for local testing)
npm run pack:lib

# Publish to npm (https://www.npmjs.com)
npm run publish:lib
```

See [projects/a-lib/README.md](projects/a-lib/README.md) for more library-specific details.

## Building

```bash
ng build a-lib
# or
npm run build:lib
```

Build artifacts go to `dist/a-lib`.

## Running unit tests

By default, `ng test a-lib` (and `npm run test:lib`) runs the tests **once** and exits (thanks to `"watch": false` in angular.json).

```bash
ng test a-lib
# or
npm run test:lib
```

For development (re-runs when files change):

```bash
ng test a-lib --watch
# or
npm run test:lib:watch
```

## Publishing

See [`.github/workflows/publish-to-npm.yml`](.github/workflows/publish-to-npm.yml) for the GitHub Action that can be triggered manually from the Actions tab ("Publish to npm" → "Run workflow").

### Manual publish steps (local)

1. Update the version in `projects/a-lib/package.json`
2. Build the library:
   ```bash
   npm run build:lib
   ```
3. Publish:
   ```bash
   npm run publish:lib
   ```

   This will publish to the public npm registry (npmjs.com).

## Code scaffolding (inside library)

From workspace root:

```bash
ng generate component my-comp --project=a-lib
# etc.
```

For full list: `ng generate --help`

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Notes

- The current package name is `@tmjeee/a-lib`. 
  - Change it in `projects/a-lib/package.json` if you want a different scope or name.
  - If you change the name, also update the matching entry in `tsconfig.json` under `compilerOptions.paths`.
- To publish a **scoped** package (`@scope/name`) to npmjs, `--access public` is required (the `publish:lib` script already includes it).
- You need an `NPM_TOKEN` secret in your GitHub repo for the automated workflow (see the workflow file for setup instructions).
- For local publishing: run `npm login` first, then `npm run publish:lib`.
