# WebShop 🛒

A full-stack **MERN e-commerce platform** with a complete shopping experience — product catalog, search, reviews, cart, multi-step checkout, **PayPal payments**, order history, and a full **admin dashboard**. Built with a security-hardened Express API and a Redux-powered React frontend.

**Live demo:** [webshop-dun.vercel.app](https://webshop-dun.vercel.app)

![React](https://img.shields.io/badge/React-17-61DAFB?logo=react&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-4-764ABC?logo=redux&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%206-47A248?logo=mongodb&logoColor=white)
![Tests](https://img.shields.io/badge/tests-Jest%20%2B%20Supertest-C21325?logo=jest&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-blue)

---

## ✨ Features

### Storefront
- **Product catalog** with search, pagination, and a featured-products carousel
- **Product reviews & star ratings**
- **Shopping cart** with quantity management and persisted state
- **Multi-step checkout** — shipping → payment method → order review
- **PayPal payments** with order confirmation and paid/delivered tracking
- **User accounts** — register, login, and editable profile with order history
- **SEO-friendly** pages via React Helmet

### Admin
- **Product management** — create, edit, and delete products with image upload
- **User management** — list, edit, and remove users
- **Order management** — view all orders and mark them as delivered

---

## 🛠 Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 17, Redux + Redux Thunk, React Router 5, React-Bootstrap, Axios, React Helmet |
| Payments | PayPal (`react-paypal-button-v2`) |
| Backend | Node.js 20, Express 4, Mongoose 6 (MongoDB) |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` password hashing |
| Validation | Zod schemas via request-validation middleware |
| Security | Helmet, HPP, CORS, `express-rate-limit`, security logging, Sentry monitoring |
| Uploads | Multer |
| Testing | Jest, Supertest, `mongodb-memory-server` (backend) + React Testing Library (frontend) |
| Tooling | Concurrently, Nodemon, Snyk, GitHub Actions CI |

---

## 🏗 Architecture

This is a monorepo with a clear client/server split:

```text
.
├── backend/                 # Express REST API
│   ├── config/              # DB connection + Sentry setup
│   ├── controllers/         # order, product, user logic
│   ├── middleware/          # auth, error handling, rate limiting, validation
│   ├── models/              # Mongoose schemas (order, product, review, user)
│   ├── routes/              # order, product, upload, user routes
│   ├── validation/          # Zod schemas
│   ├── utils/               # JWT generation, security logger
│   ├── data/                # seed data
│   ├── __tests__/           # Jest + Supertest integration tests
│   ├── seeder.js            # import / destroy sample data
│   └── server.js            # entry point
├── frontend/                # React + Redux SPA (Create React App)
│   └── src/
│       ├── actions/         # Redux actions
│       ├── reducers/        # Redux reducers
│       ├── constants/       # Redux action types
│       ├── components/      # reusable UI (Header, Rating, Paginate, …)
│       ├── screens/         # route-level views (Home, Product, Cart, Order, admin …)
│       └── store.js         # Redux store
├── uploads/                 # uploaded product images
├── .github/workflows/ci.yml # CI pipeline
└── package.json             # root scripts (run client + server together)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js **20.x** (see `.nvmrc`)
- A MongoDB instance (local or MongoDB Atlas)
- A PayPal developer Client ID

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/SilvesterSpath/WebShop.git
cd WebShop

# 2. Install backend (root) dependencies
npm install

# 3. Install frontend dependencies
npm install --prefix frontend

# 4. Create your .env file (see below)

# 5. (Optional) seed the database with sample products & users
npm run data:import

# 6. Run backend + frontend together
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

### Environment Variables

Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
SENTRY_DSN=your_sentry_dsn   # optional, for error monitoring
```

---

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run backend and frontend concurrently |
| `npm run server` | Run the backend only (with Nodemon) |
| `npm run client` | Run the frontend only |
| `npm run build` | Build the frontend for production |
| `npm run data:import` | Seed the database with sample data |
| `npm run data:destroy` | Wipe seeded data |
| `npm test` | Run frontend + backend test suites |
| `npm run security:test` | Run a Snyk vulnerability scan |

---

## 🔒 Security

Security is treated as a first-class concern (see [`SECURITY.md`](./SECURITY.md)):

- **Authentication & authorization** — JWT auth with `bcrypt`-hashed passwords and protected/admin route guards
- **Input validation** — Zod schemas validate every request body at the route boundary
- **Hardening** — Helmet security headers, HPP (HTTP parameter pollution) protection, and configurable CORS
- **Abuse control** — rate limiting on sensitive endpoints
- **Observability** — Sentry error monitoring and a dedicated security logger
- **Supply chain** — Snyk scanning and a GitHub Actions CI pipeline

---

## 🧪 Testing

- **Backend:** Jest + Supertest against an in-memory MongoDB (`mongodb-memory-server`) — covers product, order, user, upload, and error-handling flows.
- **Frontend:** React Testing Library component tests.

```bash
npm test              # everything
npm run test:backend  # API tests only
npm run test:frontend # component tests only
```

---

## 👤 Author

**Silvester Spath**
- Portfolio: [silvesterspath.me](https://silvesterspath.me)
- GitHub: [@SilvesterSpath](https://github.com/SilvesterSpath)

---

## 📄 License

This project is licensed under the ISC License.
