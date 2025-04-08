FROM public.ecr.aws/lambda/python:3.9

# Install system dependencies required for python-magic
RUN yum install -y libmagic && yum clean all

# Install Python dependencies
COPY back/requirements.txt .
RUN pip install -r requirements.txt --target /var/task

# Copy application code
COPY . /var/task/

# Set the CMD to your handler function
CMD ["main.handler"]