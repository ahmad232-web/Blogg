# ✍️ Blogg — Full-Stack Blog Web Application

<p align="center">
  <strong>A modern, API-powered blogging platform built with Django and Django REST Framework.</strong>
  <br />
  Create, publish, manage, and explore blog posts through a clean web interface and RESTful API.
</p>

<p align="center">
  ![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
  ![Django](https://img.shields.io/badge/Django-6.1.2-092E20?style=for-the-badge&logo=django&logoColor=white)
  ![DRF](https://img.shields.io/badge/DRF-3.15.2-A30000?style=for-the-badge&logo=django&logoColor=white)
  ![JWT](https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)
</p>

---

## 📌 Table of Contents

- [✨ Overview](#-overview)
- [🚀 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📸 Application Pages](#-application-pages)
- [🏗️ Project Structure](#️-project-structure)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🐳 Docker Setup](#-docker-setup)
- [🔑 Authentication](#-authentication)
- [📡 REST API Documentation](#-rest-api-documentation)
- [🗄️ Database Model](#️-database-model)
- [🧪 Testing](#-testing)
- [🔒 Security Notes](#-security-notes)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Overview

**Blogg** is a full-stack blogging application designed to demonstrate modern Django development practices, REST API development, JWT authentication, and containerized deployment.

The application allows users to register, authenticate, and manage blog posts. Visitors can explore published content through a responsive frontend, while developers can integrate with the REST API using JWT-protected endpoints.

### 🎯 Project Goals

- Build a functional blogging platform with Django.
- Implement secure, token-based API authentication.
- Provide complete CRUD operations for blog posts.
- Organize content using unique, SEO-friendly slugs.
- Support containerized application deployment with Docker.

## 🚀 Features

| Feature | Description |
|---|---|
| 👤 User Registration | Create a new account through the authentication API. |
| 🔐 JWT Authentication | Authenticate API requests using access tokens. |
| 📝 Blog Management | Create, read, update, and delete blog posts. |
| 🔗 Unique Slugs | Give each post a unique, readable URL. |
| 📄 Post Excerpts | Store short summaries of blog posts. |
| 🌍 Publishing Control | Mark posts as published or unpublished. |
| ✍️ Author Relationships | Associate posts with Django users. |
| ⚡ REST API | Access blog functionality through structured endpoints. |
| 📱 Responsive Frontend | Home, post detail, login, and signup pages. |
| 🐳 Docker Support | Package the application for containerized execution. |
| 🚀 Production Server | Gunicorn support for serving Django applications. |

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python 3.12 | Core programming language |
| Django 6.1.2 | Backend framework |
| Django REST Framework 3.15.2 | REST API development |
| Simple JWT | JWT authentication |
| HTML | Frontend markup |
| CSS | Styling and responsive layouts |
| JavaScript | Client-side interactions |
| SQLite | Development database |
| Docker | Containerization |
| Gunicorn 22.0.0 | WSGI application server |

> **Version note:** Verify the Django version against your installed environment before publishing. Django 6.1.2 may not be an officially released version; the dependency versions listed here reflect the supplied project details.

## 📸 Application Pages

The application includes the following frontend pages:

| Page | Purpose |
|---|---|
| 🏠 Home | Browse published blog posts. |
| 📖 Post Detail | Read an individual post. |
| 🔑 Login | Access an existing account. |
| 📝 Signup | Register a new account. |

*Tip: Add screenshots of your application to a `screenshots/` directory and embed them here to make your repository more visually engaging.*

## 🏗️ Project Structure

The following is a suggested structure based on the described functionality. Adjust filenames to match your actual repository.

```text
Blogg/
├── Blogg/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── blog/
│   ├── migrations/
│   ├── static/
│   │   └── blog/
│   │       ├── style.css
│   │       └── index.js
│   ├── templates/
│   │   └── blog/
│   │       ├── home.html
│   │       ├── post_detail.html
│   │       ├── login.html
│   │       └── signup.html
│   ├── admin.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── tests.py
├── manage.py
├── requirements.txt
├── Dockerfile
├── .dockerignore
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites

Ensure you have installed:

- Python 3.12
- Git
- pip
- Docker (optional)

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd Blogg
```

Replace `<YOUR_REPOSITORY_URL>` with your actual Git repository URL.

### 2. Create a virtual environment

**Windows — Git Bash:**

```bash
python -m venv venv
source venv/Scripts/activate
```

**Windows — PowerShell:**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux / macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

If `requirements.txt` does not exist, create one from the project's verified dependencies. Do not assume every package version listed above is compatible without checking.

### 4. Configure environment variables

Create a `.env` file if your settings support environment-based configuration.

Example:

```dotenv
DEBUG=True
SECRET_KEY=replace-with-a-secure-secret-key
ALLOWED_HOSTS=127.0.0.1,localhost
```

Ensure your Django settings actually load these variables. Never commit production secrets.

### 5. Apply database migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create an administrator

```bash
python manage.py createsuperuser
```

Follow the prompts to create your admin account.

### 7. Start the development server

```bash
python manage.py runserver
```

Open the application:

- **Website:** http://127.0.0.1:8000/
- **Posts API:** http://127.0.0.1:8000/api/posts/
- **Admin panel:** http://127.0.0.1:8000/admin/

These URLs assume the routes are configured as documented above.

## 🐳 Docker Setup

Blogg includes Docker support for a more consistent development and deployment environment.

### Build the Docker image

Run this command from the directory containing the `Dockerfile`:

```bash
docker build -t blogg .
```

### Run the container

```bash
docker run --rm -p 8000:8000 blogg
```

Then visit http://127.0.0.1:8000/.

> **Important:** The commands above assume your Dockerfile starts the application and listens on `0.0.0.0:8000`. Configure environment variables, persistent database storage, static files, and production settings as needed. SQLite data stored only inside a disposable container may be lost when the container is removed.

## 🔑 Authentication

Blogg uses JSON Web Tokens (JWT) through `djangorestframework-simplejwt`.

### Authentication workflow

1. Register an account.
2. Log in to receive JWT tokens.
3. Include the access token in protected API requests.
4. Refresh the access token when it expires.

### Example: Log in

```http
POST /api/auth/login/
Content-Type: application/json
```

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

The response should contain the configured token fields, commonly `access` and `refresh`.

### Example: Access a protected endpoint

```http
GET /api/auth/me/
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Replace `YOUR_ACCESS_TOKEN` with a valid access token.

## 📡 REST API Documentation

Base URL for local development:

```text
http://127.0.0.1:8000
```

### 📝 Blog Posts

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| `GET` | `/api/posts/` | List published posts | Not required |
| `POST` | `/api/posts/` | Create a post | Required |
| `GET` | `/api/posts/<slug>/` | Retrieve post details | Not required |
| `PUT` | `/api/posts/<slug>/` | Replace a post | Required |
| `PATCH` | `/api/posts/<slug>/` | Partially update a post | Required |
| `DELETE` | `/api/posts/<slug>/` | Delete a post | Required |

### 👤 Authentication

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Register a user | Not required |
| `POST` | `/api/auth/login/` | Obtain JWT tokens | Not required |
| `POST` | `/api/auth/refresh/` | Refresh an access token | Not required |
| `GET` | `/api/auth/me/` | Retrieve current user information | Required |

*Authentication requirements and response formats depend on the project's actual view and permission configuration.*

### Example: Create a post

```http
POST /api/posts/
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

```json
{
  "title": "Getting Started with Django",
  "slug": "getting-started-with-django",
  "content": "Django is a powerful Python web framework.",
  "excerpt": "An introduction to Django.",
  "is_published": true
}
```

The API may automatically assign the authenticated user as the author. If the serializer generates slugs or controls publishing fields, adjust the request body accordingly.

### Example: Update a post

```http
PATCH /api/posts/getting-started-with-django/
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

```json
{
  "title": "Getting Started with Modern Django"
}
```

### Example: Delete a post

```http
DELETE /api/posts/getting-started-with-django/
Authorization: Bearer YOUR_ACCESS_TOKEN
```

A successful deletion commonly returns `204 No Content`.

**Authorization reminder:** Requiring authentication is not the same as checking ownership. Ensure update and delete operations enforce the intended author permissions.

## 🗄️ Database Model

The `Post` model represents blog content and connects each post to a Django user.

| Field | Type | Description |
|---|---|---|
| `title` | `CharField(max_length=200)` | Post title |
| `slug` | `SlugField(unique=True)` | Unique URL identifier |
| `author` | `ForeignKey(User)` | Post author |
| `content` | `TextField` | Full post content |
| `excerpt` | `CharField` | Optional short summary |
| `created_at` | `DateTimeField` | Creation timestamp |
| `updated_at` | `DateTimeField` | Last update timestamp |
| `is_published` | `BooleanField(default=True)` | Publication status |

### Relationship overview

```text
Django User
    │
    │ One-to-Many
    ▼
   Post
    ├── title
    ├── slug
    ├── content
    ├── excerpt
    ├── created_at
    ├── updated_at
    └── is_published
```

A single user can author multiple posts. Each post belongs to one author.

## 🧪 Testing

Run the Django test suite:

```bash
python manage.py test
```

Check your project configuration:

```bash
python manage.py check
```

Recommended test coverage includes:

- User registration and authentication.
- Public access to published posts.
- Creation of posts by authenticated users.
- Post update and deletion permissions.
- Unique slug validation.
- Unpublished post visibility.
- JWT access and refresh behavior.

## 🔒 Security Notes

Before deploying Blogg publicly:

- Set `DEBUG=False`.
- Use a strong, private `SECRET_KEY`.
- Configure `ALLOWED_HOSTS` correctly.
- Use HTTPS in production.
- Keep dependencies updated.
- Never commit `.env` files, passwords, or tokens.
- Configure JWT lifetimes and authentication permissions appropriately.
- Restrict post modification and deletion to authorized authors or administrators.
- Configure static files and persistent storage for deployment.
- Use a production-ready database when appropriate for your hosting environment.

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome!

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add your feature"
   ```

4. Push your branch:

   ```bash
   git push origin feature/your-feature
   ```

5. Open a Pull Request describing your changes.

Please test your changes before submitting a pull request.

## 📄 License

No license has been specified yet.

If you intend to publish Blogg as an open-source project, add a `LICENSE` file and update this section with the chosen license.

---

<p align="center">
  <strong>Built with 🐍 Python and 💚 Django</strong>
  <br />
  If you find this project useful, consider giving the repository a ⭐
</p>
