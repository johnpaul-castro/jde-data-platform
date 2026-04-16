FROM apache/airflow:2.9.3

USER root

# Install Node.js and git
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs git && \
    apt-get clean && \
    mkdir -p /home/airflow/extractor_modules && \
    chown -R airflow:root /home/airflow/extractor_modules

USER airflow

# Install dbt
RUN pip install dbt-postgres

# Install node packages in airflow home
RUN cd /home/airflow/extractor_modules && \
    npm init -y && \
    npm install pg mssql

# Create dbt working directories
RUN mkdir -p /home/airflow/dbt_logs && \
    mkdir -p /home/airflow/.dbt && \
    mkdir -p /home/airflow/dbt_target

COPY profiles.yml /home/airflow/.dbt/profiles.yml
