# a-lib

Angular library project created following the specified steps:

- `ng new workspace --create-application=false`
- `cd workspace && ng generate library a-lib`
- Uses ng-packagr for packaging the library
- Root `workspace/package.json` contains convenience scripts for build/publish
- Includes `.github/workflows/publish-to-npm.yml` for manual GitHub-triggered publish to npmjs

See [workspace/README.md](workspace/README.md) for usage, scripts, and publishing instructions.

## Quick start (after clone)

```bash
cd workspace
npm install
npm run build:lib
```

To publish manually via GitHub UI: go to the **Actions** tab → "Publish to npm" → "Run workflow".

> Make sure the package name in `workspace/projects/a-lib/package.json` (currently `@tmjeee/a-lib`) is available to you on npmjs.com. Update the name + the matching path in `workspace/tsconfig.json` if you change the scope.
