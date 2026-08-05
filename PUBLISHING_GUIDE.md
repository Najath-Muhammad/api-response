# How to Publish to NPM: A Step-by-Step Guide

Publishing an NPM package is the process of taking your local code, bundling it up, and uploading it to the public NPM registry (`registry.npmjs.org`) so that anyone in the world can install it using `npm install @najathm/api-response`.

Here is the exact step-by-step process, along with exactly *why* you are doing each step.

---

## Step 0: Prerequisites

Before touching the terminal, you need an account on NPM.
1. Go to [npmjs.com](https://www.npmjs.com/) and create a free account.
2. Verify your email address (NPM will not let you publish without a verified email).

---

## Step 1: Authenticate Your Terminal

**The Command:**
```bash
npm login
```

**Why we do this:** 
Your terminal needs to prove to the NPM registry that you are the owner of the `@najathm` username. When you run this command, it will usually pop up a browser window asking you to log in. Once successful, it saves a secure token on your computer so you don't have to log in every time.

*(You can verify you are logged in by running `npm whoami` — it should print your username).*

---

## Step 2: Validate and Build the Code

**The Command:**
```bash
npm run prepublishOnly
```
*(Note: In this project, this automatically runs `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` in that order).*

**Why we do this:**
You never want to accidentally publish broken code. 
- The tests ensure the logic works.
- The typechecker ensures the TypeScript is strictly correct.
- The linter ensures the code formatting is clean.
- The **build** is the most important part: NPM does not run your TypeScript. It runs the JavaScript inside your `dist/` folder. The build step converts all your `.ts` files into standard JavaScript (`.js` and `.cjs`) and creates the declaration files (`.d.ts`). 

---

## Step 3: Preview the Package (The Dry Run)

**The Command:**
```bash
npm pack --dry-run
```

**Why we do this:**
This is a safety check. When you publish a package, NPM compresses your code into a `.tgz` file (a tarball). 
Running this command tells NPM: *"Show me exactly which files you are going to put in that zip file, but don't actually upload it."*

You use this to verify that:
1. Your `dist/` folder is included.
2. Your `package.json` and `README.md` are included.
3. Your massive `node_modules/` folder is **NOT** included.
4. No secret files (like `.env`) are accidentally included.

*(Because we properly configured the `"files"` array in `package.json` and the `.gitignore`, this will be clean automatically).*

---

## Step 4: Publish to the World!

**The Command:**
```bash
npm publish --access public
```

**Why we do this:**
This is the command that actually uploads your `.tgz` tarball to the NPM servers. 

**Why the `--access public` flag is required:**
Because your package name is `@najathm/api-response`, it is called a **"Scoped Package"** (it has an `@` symbol and a username). 
By default, NPM assumes that scoped packages are **Private** (meant only for companies paying for private NPM hosting). If you just run `npm publish`, it will throw an error asking for payment.
Adding `--access public` tells NPM: *"Yes, this has my name on it, but I want it to be free and open-source for everyone."*

---

## Step 5: What Happens Next?

The moment the publish command succeeds:
1. Your package is instantly live at `https://www.npmjs.com/package/@najathm/api-response`.
2. Anyone in the world can open their terminal and type `npm install @najathm/api-response`.
3. You can no longer modify that exact version number. If you find a bug, you must fix the code, change the version in `package.json` to `1.0.1` (or run `npm version patch`), and run `npm publish` again. NPM is immutable; once a version is published, it exists forever so you don't break other people's projects!
