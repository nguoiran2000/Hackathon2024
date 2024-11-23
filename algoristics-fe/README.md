
# Algoristics Frontend

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
- [Development](#development)
- [Build and Deployment](#build-and-deployment)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

The **Algoristics Frontend** is designed to deliver a responsive, user-friendly interface for managing employees, projects, and other core functionalities. It supports authentication, a dashboard, and modular pages for different application features.

## Features

- **Authentication:** Login, signup, and password reset flows.
- **Dashboard:** An intuitive dashboard for quick access to features.
- **Reusable Components:** Prebuilt UI components for consistent design.
- **Responsive Design:** Fully optimized for desktop and mobile.
- **Custom Styling:** Custom themes and utility classes using Tailwind CSS.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/algoristics-fe.git
   ```

2. Navigate to the project directory:
   ```bash
   cd algoristics-fe
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   - Copy the `.env.example` file to `.env`.
   - Fill in the required values.

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Build and Deployment

1. Build the application for production:
   ```bash
   npm run build
   ```

2. Run the production server:
   ```bash
   npm start
   ```

3. **Docker Deployment:**
   - Build the Docker image:
     ```bash
     docker build -t algoristics-frontend .
     ```
   - Run the Docker container:
     ```bash
     docker run -p 3000:3000 algoristics-frontend
     ```

## Folder Structure

```plaintext
algoristics-fe/
├── app/                # Main application directory
│   ├── (app)/          # Feature-specific layouts and pages
│   ├── (auth)/         # Authentication-related pages
│   ├── css/            # Stylesheets
├── components/         # Reusable React components
├── public/             # Static assets (images, icons, etc.)
├── Dockerfile          # Docker configuration
├── package.json        # Project metadata and dependencies
└── tailwind.config.js  # Tailwind CSS configuration
```

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
