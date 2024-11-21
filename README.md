# Password Manager API

A secure, self-hosted password manager API built with Rust and Actix-web, designed to keep your credentials safe and accessible. This API allows you to manage passwords through a set of endpoints, protected by JWT authentication, and can be easily deployed using Nginx Proxy Manager for SSL termination and domain management.

## Table of Contents

- [Features](#features)
- [Security](#security)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
  - [API Endpoints](#api-endpoints)
- [Deployment with Nginx Proxy Manager](#deployment-with-nginx-proxy-manager)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Frontend Application**: A user-friendly interface to easily access, update, delete, and manage passwords through the API.

![frontend](assets/app.png)

- **User Authentication**: Secure user registration and login using JWT tokens.
- **Password Management**: Add, delete, update, and retrieve passwords securely.
- **Secure Communication**: HTTPS support with SSL termination via Nginx Proxy Manager.
- **Self-Hosted**: Host your own password manager API on your server.

## Security

Security is a top priority in this project. Here are the measures taken to ensure your data remains secure:

- **JWT Authentication**: Uses JSON Web Tokens to authenticate users and protect API endpoints.
- **Password Hashing**: Passwords are hashed using strong hashing algorithms before storage.
- **Middleware Protection**: Custom authentication middleware ensures that only authenticated requests access protected routes.
- **Token Expiration**: JWT tokens have expiration times and are validated on each request.
- **HTTPS Encryption**: SSL/TLS encryption is enforced through Nginx Proxy Manager, ensuring secure communication between the client and server.
- **Input Validation**: All inputs are validated to prevent injection attacks and other malicious activities.

## Technologies Used

- **Rust**: The core programming language used for its performance and safety features.
- **Actix-web**: A powerful, pragmatic, and extremely fast web framework for Rust.
- **JWT (JSON Web Tokens)**: For securing API endpoints with stateless authentication.
- **Nginx Proxy Manager**: Simplifies the management of reverse proxies with a graphical user interface.
- **Docker**: Containerization for easy deployment and scalability.
- **PostgreSQL/MySQL/SQLite**: Database options for storing user data and passwords.

## Getting Started

### Prerequisites

- **Rust**: Install Rust from the [official website](https://www.rust-lang.org/).
- **Docker & Docker Compose**: For containerization.
- **Nginx Proxy Manager**: Installed on your server.
- **A Domain Name**: For accessing your API securely over HTTPS.

### Installation

#### Clone the Repository

```sh
git clone https://github.com/yourusername/password-manager-api.git
cd password-manager-api
```

#### Build the Docker Image

```sh
docker build -t password-manager-api .
```

#### Run the Docker Container

```sh
docker run -d -p 8080:8080 --name password-manager-api password-manager-api
```

### Configuration

- **Environment Variables**: Configure your database connection and JWT secret in a `.env` file or through environment variables.

  ```env
  DATABASE_URL=postgres://user:password@localhost/dbname
  JWT_SECRET=your_secret_key
  ```

- **Database Migration**: Apply database migrations if necessary.

  ```sh
  # Using Diesel CLI, for example
  diesel migration run
  ```

## Usage

### API Endpoints

#### Public Endpoints

- **Base URL**
  - `GET /api/`

- **Register New User**
  - `POST /api/new_user`
  - **Body**:
    ```json
    {
      "username": "your_username",
      "password": "your_password"
    }
    ```

- **User Login**
  - `POST /api/login`
  - **Body**:
    ```json
    {
      "username": "your_username",
      "password": "your_password"
    }
    ```
  - **Response**:
    ```json
    {
      "token": "jwt_token_here"
    }
    ```

#### Protected Endpoints

**Note**: All protected endpoints require an Authorization header with a valid JWT token.

- **Add Password**
  - `POST /api/add_password`
  - **Headers**:
    ```
    Authorization: Bearer jwt_token_here
    ```
  - **Body**:
    ```json
    {
      "site": "example.com",
      "username": "your_username",
      "password": "your_password"
    }
    ```

- **Delete Password**
  - `DELETE /api/del_password`
  - **Headers**:
    ```
    Authorization: Bearer jwt_token_here
    ```
  - **Body**:
    ```json
    {
      "password_id": 1
    }
    ```

- **Get Passwords**
  - `GET /api/get_password?query=search_term`
  - **Headers**:
    ```
    Authorization: Bearer jwt_token_here
    ```

- **Update Password**
  - `PUT /api/update_password/{id}`
  - **Headers**:
    ```
    Authorization: Bearer jwt_token_here
    ```
  - **Body**:
    ```json
    {
      "site": "new_example.com",
      "username": "new_username",
      "password": "new_password"
    }
    ```

## Deployment with Nginx Proxy Manager

Deploying your Password Manager API behind Nginx Proxy Manager allows you to manage SSL certificates and domain settings easily.

### Steps:

1. **Run the Application**
   
   Ensure your application is running and accessible on `http://localhost:8080`.

2. **Install Nginx Proxy Manager**
   
   Install Nginx Proxy Manager on your server by following the [official documentation](https://nginxproxymanager.com/).

3. **Configure a New Proxy Host**

   - **Domain Names**: Add your domain (e.g., `pm.yourdomain.com`).
   - **Scheme**: Set to `http`.
   - **Forward Hostname / IP**: Set to `localhost` or your server's IP if applicable.
   - **Forward Port**: `8080`.
   - **Websockets Support**: Enable if necessary.
   - **SSL Certificate**: Request a new SSL certificate via Let's Encrypt.

4. **Proxy Host Configuration**

5. **Adjust DNS Settings**

   Ensure your domain's DNS records point to your server's IP address.

6. **Test the Setup**

   Access your API via `https://pm.yourdomain.com/api/` to verify that everything works correctly.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.

---

*Placeholder for additional images and diagrams explaining the architecture and request flow.*

