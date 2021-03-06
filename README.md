# Starter TypeScript

Starter boilerplate including TypeScript, Webpack, Babel, Jest, tslint, Prettier

Start developing now by running

```sh
npm i
npm dev
```

# TypeScript

This project uses TypeScript. All configurations are in `etc/typescript`, and then used by means of the `extends` property where they are needed.

For example, the presence of `src/server/tsconfig.json` indicates that `src/server` is a typescript project. The configuration is loaded by means of an extends from `etc/typescript/tsconfig.server.json`.

This repo contains three typescript projects:

- Client: The client code to run in the browser. Found at `src/client`.
- Server: The server code that serves client code and interacts with the database. Found at `src/server`.
- Build: The code responsible for building the Client and the Server code with Webpack using its Node API. Found at `etc/webpack`.

## Module resolution

Although the project uses TypeScript, it's only being used for type checking in the Client and Server projects, not for building. Webpack is being used for building. Therefore, many of the compiler options are not needed since Webpack will take care of module resolution and code transpilation via `babel-loader` configured with `@babel/preset-typescript`.

Module resolution configuration must be the same across all systems trying to resolve dependencies: TypeScript, Webpack, and Jest. This repo uses Node's resolution strategy (commonjs) and a few aliases. The configuration required for all systems to interpret the code in the same way is:

**TypeScript**

- Set `"moduleResolution": "node"`
- Set aliases somewhere...

**Webpack**

**Jest**

## Note on settings TypeScript compiler settings applied to files imported by several projects

The compiler settings applied to a module that does not reside within a project's directory structure will be that of the current project being built. For example, given

```
/common
  /helpers.ts
/project1
  /index1.ts # imports helpers
  /tsconfig.json
/project2
  /index2.ts # also imports helpers
  /tsconfig.json
```

module `helpers.ts` will be compiled with `/project1/tsconfig.json` settings when compiler Project 1, and with `/project2/tsconfig.json` settings when compiling Project 2.

However, IDEs tend to look for the closest parent `tsconfig.json` (or apply the default settings when none is found), which might result in slight discrepancies.

Also, not sure if babel, will use the closest parent tsconfig.json to the file being transpiled, or the closest tsconfig.json to the entry file.

Currently, files in `/etc/babel` are affected by this. Will consider moving them into the `/etc/webpack` TS project to avoid these issues.

# Config files

Config files used by the various tools in this repo are in `etc`.

# Building

This project uses Webpack for building the code. The build files themselves are written in typescript too.

However, contrary to what's suggested on Webpack's own documentation, this project does not use `ts-node` or similar tools that rely on `node-interpret`. The build tools used by `node-interpret` rely on Node's deprecated `require.extensions`.

Therefore, this project opts instead to transpile the ts files first, and then run them to build the code.

## Source maps

To understand how source maps are set up, we must take a closer look at how the code is compiled, and how it is run

### Client

Although we're using TypeScript for type-checking, Babel is the tool that actually performs the transpilation using the TypeScript preset. As noted by Webpack's [documentation](https://webpack.js.org/guides/typescript/#source-maps), the tool performing the transpilation should add inline source maps. Webpack can pick up on them by setting `devtool: inline-source-maps`.

### Server

This one might be a bit tricky.

Also, we're using `source-map-support` for the proper stack traces on error.

# Tests

# Coding style and formatting

Using tslint and Prettier.

Either tslint or Prettier may be run at any time with

```sh
npm run lint
npm run prettier
```

Note that this only reports errors, it does not modify files to fix them. To fix them, you can run

```sh
npm run lint:fix
npm run prettier:fix
```

To fix everything in one go, use

```sh
npm run cleanCode
# or
npm run cleanCode:watch
```

If you take a look at the scripts, you'll notice the flag `--silent`. This flag is consumed by npm and prevents its extremely verbose error messages when linting fails.

Nevertheless, if they fail, the top level call to `npm run` (the one you type into the console) will display npm's verbose error messages. Consider using --silent when invoking `npm run` yourself.

## tslint

Using `tslint:all` When using tslint's type-checking rules, we must indicate which project we want to lint. tslint uses the project's tsconfig.json to determine which files to lint.

## prettier

While the files to include are specified using a CLI argument, the files to exclude are specified in `.prettierignore`.

By default, prettier will output code to stdout. It does not report what parts of the code need to be fixed.

# Goodies for devs on vscode

## Note on unused variables with tslint

Currently need to activate compiler settings

```json
{
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```

to receive unused errors within the editor. See Microsoft/vscode-tslint#185. This repo is using `tslint:all` to ensure that tslint also catches type errors.

## Specifying desired tsconfig

Following

- https://github.com/Microsoft/vscode/issues/12463

## Specifying tslint config to use

With [TSLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint), use `tslint.configFile`. In this project, `"tslint.configFile": "etc/tslint/tslint.json"`.

## Automatic code formatting with Prettier integration

Install [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and enable the following editor preferences:

```json
{
  "editor.formatOnPaste": true,
  "editor.formatOnSave": true
}
```

Note that the plugin currently does not support specifying the location and therefore expects it to be in the root of the directory. If that's not the case, you'll have to manually copy the properties in your .prettierrc to the plugin's.

For this repo, make sure to add the following to the workspace's config to match what's in etc/prettier:

```json
{
  "prettier.trailingComma": "all",
  "prettier.singleQuote": true
}
```

## Note on using tslint and Prettier together

Might need to save a few times for all fixes and code formatting to take place.

# Ideas

## Tests

Create new projects for testing to avoid issues with ignoring test files in tsconfig.json.

- src/client
- src/clientTests
- src/server
- src/serverTests

Could also add a commit hook when tests are missing:

> No tests found for `src/path/to/file`. An empty test file has been created. Please add tests before continuing.

The test file would add a generic failing test, which would then trip up the prepush hook.
