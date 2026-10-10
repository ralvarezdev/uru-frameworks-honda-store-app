# uru-frameworks-honda-store-app

An Angular 19 storefront for Honda parts with Firebase authentication, a product catalog and a cart. Built for the Frameworks course at Universidad Rafael Urdaneta.

**Note:** This repository is archived and read-only.

## Features

- **Products** — Public product list (`/products`), product detail, and per-user pages to create, edit and list your own products (`/new-product`, `/edit-product/:id`, `/my-products`).
- **Cart** — Authenticated cart page (`/my-cart`).
- **Authentication** — Sign in and sign up through Firebase Auth, with auth and not-auth route guards.

## Configuration

Copy the two example files and fill in your own values; the real files are gitignored.

- **`firebase.example.json` -> `firebase.json`** — Firebase web app settings: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`, `measurementId`.
- **`cloudFunctions.example.json` -> `cloudFunctions.json`** — `url`, a URL template for the deployed cloud functions. Function names are passed with underscores replaced by hyphens.

## Development

```bash
npm install
ng serve        # http://localhost:4200/
ng build        # output in dist/
ng test         # Karma unit tests
```

`EMULATOR_ACTIVE` in `src/constants.ts` switches the cloud function calls to the Firebase emulator.

## Project structure

- **`src/app/features/auth`** — Guards, layout, sign-in and sign-up pages.
- **`src/app/features/firebase`** — Firebase app and auth services.
- **`src/app/features/store`** — Store pages, layouts and services.
- **`src/app/shared`** — Shared components, directives and services.

Generated with Angular CLI 19.2.1; see the [Angular CLI reference](https://angular.dev/tools/cli).
