# ALib

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.0.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the library, run:

```bash
ng build a-lib
```

This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

### Publishing the Library

Once the project is built, you can publish your library by following these steps:

1. Navigate to the `dist` directory (from workspace root):

   ```bash
   cd dist/a-lib
   ```

2. Run the `npm publish` command to publish your library to the npm registry:
   ```bash
   npm publish
   ```

See also the root `package.json` script: `npm run publish:lib`.

> The library publishes to the public npm registry by default.
> Make sure the name in `projects/a-lib/package.json` is one you own on https://www.npmjs.com (change the scope if needed, and update the path mapping in the workspace `tsconfig.json`).

## Running unit tests

Tests use Vitest (via `@angular/build:unit-test`).

From the workspace root:

```bash
ng test a-lib
# or
npm run test:lib
```

See the main [README.md](../README.md) for watch mode and more details. The default is to run once and exit.

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
