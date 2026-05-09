# NoteBash

A private, personal information vault built with React and Firebase. Store and organise important data — bank accounts, documents, credentials, and more — in one secure place accessible only by you.

---

## Features

- Google Sign-In with email whitelisting — only authorised accounts can access the vault
- Flexible entry system — each entry can have any number of custom fields with no fixed schema
- Sensitive field masking — mark fields as sensitive to hide their values by default, with a show/hide toggle
- Copy to clipboard — copy any field value with a single click
- Custom categories — create, reorder, and delete categories to organise your data your way
- Fully private — data is scoped to your user account and inaccessible to anyone else

## Tech Stack

- React 18 + Vite
- Firebase Authentication (Google Sign-In)
- Firebase Firestore
- Tailwind CSS
- React Router

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Authentication and Firestore enabled

### 1. Clone the repository

```bash
git clone https://github.com/your-username/notebash.git
cd notebash
```

### 2. Configure Firebase

Open `src/firebase/config.js` and replace the placeholder values with your Firebase project config, available at Firebase Console → Project Settings → Your Apps.

### 3. Set authorised email

Open `src/context/AuthContext.jsx` and add your Gmail address to the `ALLOWED_EMAILS` array.

### 4. Install dependencies and run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Deployment

### Netlify

1. Push the repository to GitHub
2. Connect the repository to Netlify
3. Set build command to `npm run build` and publish directory to `dist`
4. Add your Netlify domain to Firebase Console → Authentication → Authorised domains

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
npm run build
firebase deploy
```

## Data Import

A one-time import script is available in the `import/` folder to migrate data from an existing source into Firestore. See `SETUP.md` for instructions.

## Security

Firestore security rules are defined in `firestore.rules`. Only authenticated users can read or write their own data — no other user or external party can access it. Deploy the rules via the Firebase Console or Firebase CLI.

## License

Private — not intended for public distribution.
