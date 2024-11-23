
# Algoristics Backend

## Features
- **FastAPI** for creating RESTful APIs.
- Modular structure with services and routers.
- Docker support for easy containerization.
- `.env` support for environment variable management.

## Project Structure
```
algoristics-be/
├── app/
│   ├── __init__.py
│   ├── config.py           # Configuration settings
│   ├── main.py             # Application entry point
│   ├── models/             # Pydantic models for request/response validation
│   ├── routers/            # API routers for modular endpoints
│   ├── services/           # Business logic and utilities
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (example provided)
├── .gitignore              # Git ignore rules
```

## Prerequisites
- **Python 3.9+** (3.12 compatible locally, but Docker uses 3.9-slim).
- **Docker** and **Docker Compose** installed.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd algoristics-be
   ```

2. **Create a virtual environment (optional):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up the environment variables:**
   - Copy the `.env.example` file to `.env` and update the values as needed.

5. **Run the application:**
   ```bash
   uvicorn app.main:app --reload
   ```

   The application will be accessible at `http://127.0.0.1:8000`.

## Running with Docker

1. **Build the Docker image:**
   ```bash
   docker build -t algoristics-backend .
   ```

2. **Run the container:**
   ```bash
   docker-compose up
   ```

   The service will be available at `http://127.0.0.1:8000`.

## Contributing
Feel free to submit issues or pull requests for improvements and bug fixes.

## License
This project is licensed under the [MIT License](LICENSE).
