# 1. Base on AWS Lambda Python 3.11 image
FROM public.ecr.aws/lambda/python:3.11

# 2. Install system dependencies
#    - file/libmagic for python-magic
#    - libjpeg-turbo-devel and poppler-utils for pdfplumber’s PDF parsing
RUN yum install -y \
      file \
      libmagic \
      poppler-utils \
      libjpeg-turbo-devel \
    && yum clean all

# 3. Copy & install Python deps
WORKDIR /var/task
COPY back/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy application code with proper structure
COPY back/ /var/task/back/
COPY main.py /var/task/

# 5. Lambda entrypoint
CMD ["main.handler"]
