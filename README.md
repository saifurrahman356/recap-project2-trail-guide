# Trail Guide – Hiking Trail Discovery Platform

## 1. Project Description

**Trail Guide** is a full-stack web application designed to help users discover, explore, and manage hiking trails across different regions and countries.

The application allows visitors to browse hiking trails, explore geographical regions, search for trails, and filter results based on difficulty. Each trail contains detailed information, including its name, description, distance, difficulty level, location, image, and associated tags.

The project also provides an administrative interface for managing trails and a RESTful API that allows external applications to retrieve and manage trail information securely.

The application follows a modular MVC-inspired architecture, separating routes, controllers, business logic, database operations, middleware, and presentation templates.

### Key Features

**Trail Discovery**

- Browse all available hiking trails.
- View detailed information about individual trails.
- Explore trails grouped by geographical region.
- Search trails by title.
- Filter trails by region and difficulty.
- Navigate through paginated trail listings.

**Trail Management (Admin Panel)**

- Create new hiking trails.
- Edit existing trail information.
- Delete trails.
- Assign multiple tags to a trail.
- Manage trail descriptions using the Quill rich-text editor.
- Associate trails with geographical regions.

**RESTful API**

- Retrieve all trails with pagination.
- Retrieve individual trails using their slug.
- Retrieve all available regions.
- Retrieve trails belonging to a specific region.
- Create, update, and delete trails.
- Support partial updates through the PATCH endpoint.
- Protect write operations using API key authentication.
- Apply rate limiting to write requests.

**Security and Data Management**

- API key authentication through HTTP headers.
- Rate limiting with a maximum of five write requests per minute per API key.
- HTML sanitization for trail descriptions.
- Parameterized SQL queries to protect against SQL injection.
- SQLite foreign key constraints.
- Database transactions for creating and updating trails and their tag associations.
- Centralized request logging.

### Technology Stack

| Category          | Technology         |
| ----------------- | ------------------ |
| Runtime           | Bun                |
| Language          | TypeScript         |
| Backend Framework | Express.js 5       |
| Database          | SQLite             |
| Database Access   | sqlite and sqlite3 |
| Template Engine   | Nunjucks           |
| Frontend Styling  | Pico.css           |
| Rich Text Editor  | Quill              |
| HTML Sanitization | sanitize-html      |
| HTTP Middleware   | Express middleware |
| Code Formatting   | Prettier           |
| Version Control   | Git                |

### Application Architecture

The project uses a modular MVC-inspired structure.

```text
src/
├── controllers/
│   ├── adminController.ts
│   ├── apiRegionController.ts
│   ├── apiTrailController.ts
│   ├── regionController.ts
│   ├── trailController.ts
│   └── utils.ts
│
├── middleware/
│   ├── apiKey.ts
│   ├── logger.ts
│   └── rateLimitMiddleware.ts
│
├── models/
│   ├── db.ts
│   ├── regionModel.ts
│   ├── tagModel.ts
│   └── trailModel.ts
│
├── routes/
│   ├── adminRoutes.ts
│   ├── apiRoutes.ts
│   └── websiteRoutes.ts
│
├── service/
│   ├── errorHandlerService.ts
│   ├── sanitizeContentService.ts
│   ├── trailFilterService.ts
│   ├── trailPaginationService.ts
│   └── trailPrepareSerivce.ts
│
├── utils/
│   ├── typeGuards.ts
│   └── utils.ts
│
├── app.ts
└── types.ts

db/
├── seed.sql
└── trail-guide.db

public/
├── css/
│   └── styles.css
└── js/
    └── trail-editor.js

views/
├── admin/
├── error/
├── macros/
├── base.html
├── index.njk
├── region.njk
├── regions.njk
└── trail.njk
```

**Architecture Responsibilities**

- **Routes:** Define application URLs and connect them to controllers.
- **Controllers:** Handle HTTP requests and responses.
- **Models:** Manage database operations and SQL queries.
- **Services:** Handle business logic, validation, filtering, pagination, and sanitization.
- **Middleware:** Handle API authentication, rate limiting, and request logging.
- **Views:** Render the user interface using Nunjucks templates.
- **Types:** Define TypeScript interfaces and shared application types.
- **Utils:** Provide reusable utility functions and type guards.

### Database Design

The application uses SQLite with four main tables:

| Table        | Responsibility                                                |
| ------------ | ------------------------------------------------------------- |
| `trails`     | Stores hiking trail information.                              |
| `regions`    | Stores geographical region information.                       |
| `tags`       | Stores available trail tags.                                  |
| `trail_tags` | Connects trails and tags through a many-to-many relationship. |

**Database Relationships**

- One region can contain multiple trails.
- One trail belongs to one region.
- One trail can have multiple tags.
- One tag can be assigned to multiple trails.
- The `trail_tags` junction table manages the many-to-many relationship.

Foreign key constraints maintain referential integrity, while database transactions ensure that trail records and their tag associations are saved consistently.

---

## 2. Dependencies

The project uses Bun as its JavaScript runtime and package manager.

### Runtime Dependencies

| Package         | Purpose                                                          |
| --------------- | ---------------------------------------------------------------- |
| `express`       | Provides the HTTP server, routing, and middleware functionality. |
| `sqlite`        | Provides an asynchronous API for SQLite database operations.     |
| `sqlite3`       | Provides the SQLite database driver.                             |
| `nunjucks`      | Renders dynamic HTML templates.                                  |
| `cookie-parser` | Parses cookies from incoming HTTP requests.                      |
| `quill`         | Provides a rich-text editor for trail descriptions.              |
| `sanitize-html` | Sanitizes HTML content to prevent unsafe HTML injection.         |

### Development Dependencies

| Package                          | Purpose                                                       |
| -------------------------------- | ------------------------------------------------------------- |
| `typescript`                     | Provides static typing and TypeScript compilation.            |
| `@types/node`                    | Type definitions for Node.js APIs.                            |
| `@types/express`                 | Type definitions for Express.                                 |
| `@types/nunjucks`                | Type definitions for Nunjucks.                                |
| `@types/cookie-parser`           | Type definitions for cookie-parser.                           |
| `@types/sanitize-html`           | Type definitions for sanitize-html.                           |
| `prettier`                       | Formats source code consistently.                             |
| `prettier-plugin-jinja-template` | Provides Prettier support for Nunjucks/Jinja-style templates. |
| `nodemon`                        | Monitors files and restarts the development process.          |
| `tsx`                            | Executes TypeScript files directly.                           |

### Prerequisites

Before installing the application, ensure the following tools are available:

1. **Bun:** JavaScript runtime and package manager.
2. **Git:** For cloning the repository.
3. **SQLite CLI (optional):** Required if you want to execute the provided SQL seed script using the command line.

---

## 3. Installation

Follow these steps to set up and run the project locally.

### Step 1: Clone the Repository

```bash
git clone <repository-url>
```

Navigate to the project directory:

```bash
cd recap-project2-trail-guide
```

### Step 2: Install Bun

If Bun is not already installed, follow the official installation instructions:

https://bun.sh/docs/installation

Verify the installation:

```bash
bun --version
```

### Step 3: Install Dependencies

Install all project dependencies using Bun:

```bash
bun install
```

This command reads `package.json` and `bun.lock` and installs the required runtime and development dependencies.

### Step 4: Configure Environment Variables

Create a `.env` file in the project root directory.

```env
PORT=3000
DB_PATH=
API_KEY=your-secret-api-key
```

**Environment Variable Description**

| Variable  | Description                                                 | Default             |
| --------- | ----------------------------------------------------------- | ------------------- |
| `PORT`    | Port on which the Express server runs.                      | `3000`              |
| `DB_PATH` | Path to the SQLite database file.                           | `db/trail-guide.db` |
| `API_KEY` | Secret API key required for protected API write operations. | Must be configured  |

**Important:** Replace `your-secret-api-key` with a private API key. Never commit your actual `.env` file to Git.

If `DB_PATH` is empty, the application uses the default database location:

```text
db/trail-guide.db
```

Bun automatically loads environment variables from the root `.env` file.

### Step 5: Initialize the Database

The project includes a SQLite database file:

```text
db/trail-guide.db
```

It also includes a SQL seed file:

```text
db/seed.sql
```

The seed script creates the database tables and inserts sample regions, hiking trails, and tags.

If you want to initialize or reset the database using the seed script, execute:

```bash
sqlite3 db/trail-guide.db < db/seed.sql
```

**Warning:** The seed script drops and recreates the existing tables. Running it again will erase existing database records and restore the sample data.

If you already have the supplied database populated, you do not need to run the seed script.

### Step 6: Start the Development Server

Run the application using the existing development script:

```bash
bun run dev
```

The development server starts on:

```text
http://localhost:3000
```

The application uses Bun's watch functionality to monitor source changes during development.

### Step 7: Access the Application

Once the server is running, open the following URLs in your browser:

| Page            | URL                                    |
| --------------- | -------------------------------------- |
| Home            | http://localhost:3000/                 |
| Regions         | http://localhost:3000/regions          |
| Admin Dashboard | http://localhost:3000/admin            |
| Create Trail    | http://localhost:3000/admin/trails/new |

### Step 8: Type Checking

Run TypeScript's compiler without generating JavaScript files:

```bash
bunx tsc --noEmit
```

This checks the project for TypeScript errors.

### Step 9: Database Seeding (Optional)

To restore the original sample data at any time:

```bash
bun run db:seed
```

This command uses the SQLite CLI, which must be installed separately.

---

**Project Status**

The application is structured as a modular TypeScript and Express project, with SQLite persistence, a server-rendered frontend, an administrative interface, and a protected REST API.

For development, use `bun run dev`. For database initialization, use the provided SQL seed script when needed.
