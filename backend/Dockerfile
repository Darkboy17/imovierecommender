# Choose our version of Python
FROM python:3.10

# Set up a working directory
WORKDIR /app

# Copy just the requirements into the working directory so it gets cached by itself
COPY ./requirements.txt ./requirements.txt

# Install the dependencies from the requirements file
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the entire project to the working directory
COPY . .

# Make port 3001 available to the world outside this container
EXPOSE 3001

# Run the Uvicorn server using the specified app
#CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3001"]

# Run the application with proxy headers enabled
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3001", "--proxy-headers", "--forwarded-allow-ips", "*"]