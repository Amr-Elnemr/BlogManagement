# 📝 Blog Management Backend

This is the backend service for a blog management system, built with **Express.js** and **TypeScript**. It provides a robust set of APIs to handle all aspects of blog content, including creating, reading, updating, and deleting posts, managing users, and handling authentication.

---

## 🚀 Getting Started

### Prerequisites

You'll need the following installed:

- **Node.js** (LTS version recommended)
- **MongoDB** running locally or a cloud-hosted MongoDB URI.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [Your Repository URL]
    cd BlogManagement
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables (optional):**

    - Override a file the `.env` & `.env.testing` in the root directory.
    - Add your MongoDB connection string and other configurations (e.g., port, JWT secret).

    > **⚠️ Note on `.env` files:** For ease of testing and local setup, any `.env` files committed to this repository are intended for local development and testing only. **They do not contain any production secrets or sensitive credentials.** Production secrets are managed separately and securely.

4.  **Run the application (Development):**

    ```bash
    npm run dev
    ```

    The server should start on the port specified in your configuration (typically `http://localhost:3000`).

---

Here is the updated **"Built With"** section for your README, incorporating the dependencies and dev dependencies you provided.

---

## 🛠️ Built With

This project is constructed using the following primary stack, core dependencies, and development tools:

### Primary Stack

- **Express.js** — The fast, unopinionated, minimal web framework for Node.js.
- **TypeScript** — The primary language for the codebase, providing strong static typing.
- **MongoDB** — The NoSQL database technology.
- **Mongoose** — The Object Data Modeling (ODM) library for MongoDB.

### Core Dependencies

These are the essential packages required to run the application:

- **Authentication & Security:**
  - **`bcrypt`**: Used for securely hashing user passwords.
  - **`jsonwebtoken`**: For creating and verifying JSON Web Tokens (JWT) for user authentication.
  - **`helmet`**: Helps secure Express apps by setting various HTTP headers.
- **Configuration & Validation:**
  - **`@dotenvx/dotenvx`**: Used for loading environment variables from the `.env` file.
  - **`joi`**: A powerful schema description language and data validator.

### Development & Tooling

These packages are used for development, testing, and building the project:

- **Testing:**
  - **`jest`** / **`ts-jest`** / **`babel-jest`**: The primary testing framework and TypeScript/Babel integration.
  - **`supertest`**: Used for testing HTTP assertions with Express.
- **Development Utilities:**
  - **`nodemon`**: Automatically restarts the node application when file changes are detected.
  - **`tsx`**: A simple, fast, zero-config way to run TypeScript in Node.js.
- **Typings:**
  - **`typescript`**: The core TypeScript compiler.
  - **`@types/*`**: Type definitions for dependencies like `express`, `cors`, `jest`, and `supertest`.

---

## 🌐 API Endpoints

The following are the main categories of endpoints available, corresponding to the routes defined in the Postman collection:

| **Resource**       | **Method** | **Endpoint**            | **Description**                                                                                   | **Requires Auth?** |
| ------------------ | ---------- | ----------------------- | ------------------------------------------------------------------------------------------------- | ------------------ |
| **Authentication** | `POST`     | `/user`                 | Register/Sign Up a new user.                                                                      | No                 |
|                    | `POST`     | `/user/login`           | Log in and receive a JWT.                                                                         | No                 |
| **Posts (Blog)**   | `GET`      | `/blog`                 | Retrieve a list of all posts (default, unfiltered).                                               | No                 |
|                    | `GET`      | `/blog?page=1&limit=10` | Retrieve a specific page of posts (Pagination).                                                   | No                 |
|                    | `GET`      | `/blog/category=Tech`   | Filter posts by category.                                                                         | No                 |
|                    | `GET`      | `/blog?search=keyword`  | Search posts title and content by keyword across relevant fields.                                 | No                 |
|                    | `POST`     | `/blog`                 | Create a new blog post.                                                                           | Yes                |
|                    | `PUT`      | `/blog/:id`             | Update an existing post by its ID.                                                                | Yes                |
|                    | `DELETE`   | `/blog/:id`             | Delete a post by its ID. (Based on common REST practice, overriding the `PUT` in the collection). | Yes                |

> **📘 Postman Collection:** A comprehensive Postman collection with examples for all API endpoints is available in this repository. You can find it here:
>
> 🔗 [Link to Postman Collection file or directory](./BlogManagement.postman_collection.json)

---

## ✅ Testing

To run the unit and integration tests:

```bash
npm test
```

---

## Project Structure

### Main Directories

**src/** - Source code directory

- `helpers/` - Utility functions and helper modules
- `middlewares/` - Express middleware functions
- `model/` - Database models and schemas
- `router/` - Route definitions and API endpoints
- `types/` - TypeScript type definitions
  - `express.d.ts` - Express type extensions
- `config.ts` - Configuration types
- `db.ts` - Database types
- `index.ts` - Type exports

**tests/** - Test suites

- `integration/` - Integration tests
  - `user.test.ts` - User integration tests
- `unit/` - Unit tests
  - `user.test.ts` - User unit tests

### Configuration Files

- `.env` - Environment variables (not in repository)
- `.env.testing` - Testing environment configuration
- `.gitignore` - Git ignore patterns
- `jest.config.js` - Jest testing framework configuration
- `tsconfig.json` - TypeScript compiler configuration
- `package.json` - Project metadata and dependencies
- `package-lock.json` - Locked dependency versions

### Other Files

- `BlogManagement.postman_collection.json` - Postman API collection for testing
- `TODO` - Project tasks and future improvements
- `README.md` - Project documentation

---

## ⚙️ Available Scripts

In the project directory, you can run the following commands:

| Command                 | Description                                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run dev`           | Starts the application in **development mode**. It uses `tsx` and `watch` for hot reloading whenever you make changes in `src/`.                       |
| `npm run build`         | Compiles the TypeScript source code (`src/`) into JavaScript in the `dist/` directory.                                                                 |
| `npm start`             | Runs the compiled JavaScript application from `dist/index.js`. Use this command to run the application in a **production environment** after building. |
| `npm test`              | Executes all tests using Jest in watch mode. It loads environment variables from `.env.testing` and `.env` via `dotenvx`.                              |
| `npm run test:coverage` | Runs tests, displays detailed output, and generates a **code coverage report**.                                                                        |
| `npm run test:leaks`    | Runs Jest with the `--detectOpenHandles` flag to find processes or handles that prevent the testing suite from cleanly exiting.                        |
