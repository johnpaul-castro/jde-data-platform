from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.empty import EmptyOperator

EXTRACTOR = "node /opt/airflow/extractors/extract_all.js"
DBT       = "cd /opt/airflow/dbt/jde && dbt"
PROFILES  = "--profiles-dir /home/airflow/.dbt"

default_args = {"owner": "jp", "retries": 1, "retry_delay": timedelta(minutes=2), "email_on_failure": False}

with DAG(
    dag_id="jde_full_load",
    description="Full reload: Bronze → Silver → Gold → Test",
    schedule="0 1 * * 0",
    start_date=datetime(2025, 1, 1),
    catchup=False,
    default_args=default_args,
    tags=["bronze", "silver", "gold", "jde"],
) as dag:

    start           = EmptyOperator(task_id="start")
    bronze_complete = EmptyOperator(task_id="bronze_complete")
    dbt_silver      = BashOperator(task_id="dbt_silver", bash_command=f"{DBT} run --select silver {PROFILES}")
    dbt_gold        = BashOperator(task_id="dbt_gold",   bash_command=f"{DBT} run --select gold {PROFILES}")
    dbt_test        = BashOperator(task_id="dbt_test",   bash_command=f"{DBT} test {PROFILES}")
    done            = EmptyOperator(task_id="done")

    jde_tables = ["F0101","F0116","F03B11","F4101","F4102","F41021","F4201","F4211","F4301","F4311"]

    for table in jde_tables:
        t = BashOperator(task_id=f"extract_{table}", bash_command=f"{EXTRACTOR} {table}")
        start >> t >> bronze_complete

    bronze_complete >> dbt_silver >> dbt_gold >> dbt_test >> done
