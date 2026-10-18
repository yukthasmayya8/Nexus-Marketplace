<div align="center">
  <img width="1200" height="475" alt="Narasimha Kripa Bazaar" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Narasimha Kripa Bazaar

Narasimha Kripa Bazaar is a modern full-stack marketplace application that connects buyers and sellers through a simple and intuitive digital shopping experience.

The platform enables sellers to create and manage product listings, while buyers can browse products, manage a shopping cart, and place orders. Firebase provides authentication and data storage, while Gemini AI supports enhanced application functionality.

## Features

### Buyer Features

- Browse products by category
- View product details, prices, stock, and specifications
- Add products to a shopping cart
- Update item quantities or remove products from the cart
- Place and manage orders
- Manage account information

### Seller Features

- Create and manage product listings
- Add product descriptions, prices, stock, categories, and images
- Update product information and availability
- View products listed on the marketplace
- Manage customer orders

### Platform Features

- Role-based buyer and seller experiences
- Firebase Authentication
- Cloud Firestore data management
- Responsive and user-friendly interface
- Product search and category-based browsing
- Shopping cart and order management
- AI-powered functionality through the Gemini API
- Interactive notifications and UI feedback

## Technology Stack

- **Frontend:** React 19, TypeScript, and Vite
- **Styling:** Tailwind CSS
- **Backend Services:** Firebase
- **Database:** Cloud Firestore
- **Authentication:** Firebase Authentication
- **AI Integration:** Google Gemini API
- **Icons:** Lucide React
- **Animations:** Motion
- **Notifications:** React Hot Toast

## Project Structure

```text
Nexus-Marketplace/
├── src/                    # Application source code
├── public/                 # Static assets
├── .env.example            # Environment variable template
├── firebase-applet-config.json
├── firebase-blueprint.json # Firebase data model definitions
├── firestore.rules         # Firestore security rules
├── index.html              # Application entry point
├── package.json            # Dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # Project documentation
```

## Prerequisites

Before running the project locally, install the following:

- [Node.js](https://nodejs.org/)
- npm, included with Node.js
- Git
- A Firebase project
- A Gemini API key, if AI features are enabled

Verify your Node.js and npm installations:

```bash
node --version
npm --version
```

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/yukthasmayya8/Nexus-Marketplace.git
cd Nexus-Marketplace
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file from the provided template:

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```env
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
```

Never commit `.env.local` or expose private API keys in the repository.

### 4. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server on port 3000. |
| `npm run build` | Creates an optimized production build. |
| `npm run preview` | Previews the production build locally. |
| `npm run lint` | Runs TypeScript checks without emitting files. |
| `npm run clean` | Removes the production build directory. |

## Production Build

Create an optimized production build with:

```bash
npm run build
```

Preview the generated build locally with:

```bash
npm run preview
```

## Firebase Configuration

Narasimha Kripa Bazaar uses Firebase services for authentication and application data. Configure the Firebase project according to the repository's Firebase configuration and security rules.

The primary data entities include:

- Users
- Products
- Orders
- Shopping carts

Firestore security rules are defined in `firestore.rules`.

## Security Notes

- Never commit `.env.local` or files containing private API keys.
- Use environment variables for Gemini and other sensitive configuration.
- Review and test Firestore security rules before deployment.
- Restrict Firebase access according to buyer and seller roles.
- Do not use development credentials in production.

## Application Name

The application is branded as **Narasimha Kripa Bazaar**. The repository name remains `Nexus-Marketplace` for compatibility with the existing project structure.

## License

No formal open-source license has been specified for this project. Contact the repository owner before redistributing or using the application beyond personal, educational, or demonstration purposes.
