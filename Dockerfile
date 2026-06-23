FROM python:3.12-slim
WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy the backend files
COPY backend/ ./backend/

# Directly copy your working, pre-built dark layout folder
COPY frontend/dist ./frontend/dist

ENV PORT=8080
EXPOSE 8080

CMD ["python", "backend/server.py"]