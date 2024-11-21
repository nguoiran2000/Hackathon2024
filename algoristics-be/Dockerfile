# Use an official Python runtime as a base image
FROM python:3.9-slim
ENV http_proxy="http://10.16.32.13:8080"
ENV https_proxy="http://10.16.32.13:8080"

# Set the working directory in the container
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the current directory contents into the container
COPY . .

# Expose port 8000
EXPOSE 8000

# Command to run FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
