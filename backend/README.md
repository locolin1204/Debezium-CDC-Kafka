# CDC Kafka

### Step 1
Start Docker container
```bash
docker-compose up -d
```


### Step 2

``` bash
# Enter the postgres container
docker-compose exec postgres psql -U postgres -d inventory

# (Inside the SQL prompt)
CREATE TABLE "order" (id SERIAL PRIMARY KEY, product_name VARCHAR(100), quantity int, created_datetime TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, last_modified_datetime TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP);
INSERT INTO "order" (product_name, quantity, last_modified_datetime) VALUES ('Laptop', 2, NULL);
INSERT INTO "order" (product_name, quantity, last_modified_datetime) VALUES ('Smartphone', 5, NULL);

# Exit psql
\q
```

### Step 3
Send a JSON configuration to Debezium telling it how to connect to Postgres. 

`order`
```bash
curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" http://localhost:8083/connectors/ -d '{
  "name": "order-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "postgres",
    "database.password": "postgres",
    "database.dbname": "inventory",
    "topic.prefix": "dbserver1",
    "table.include.list": "public.order",
    "plugin.name": "pgoutput"
  }
}'
```

### Step 4
Watch topic
```bash
docker-compose exec kafka /kafka/bin/kafka-console-consumer.sh \
    --bootstrap-server kafka:9092 \
    --from-beginning \
    --property print.key=true \
    --topic dbserver1.public.order
```

### Step 5
Add db trigger for last_modified_datetime
``` postgresql
CREATE OR REPLACE FUNCTION update_last_modified_datetime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified_datetime = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_last_modified
BEFORE UPDATE ON "order"
FOR EACH ROW
EXECUTE FUNCTION update_last_modified_datetime();
```

## Appendix
Delete Debezium connector
```bash
curl -X DELETE http://localhost:8083/connectors/order-connector
```

See all kafka topics
```bash
docker-compose exec kafka /kafka/bin/kafka-topics.sh --list --bootstrap-server kafka:9092
```


reading this: 
1. https://medium.com/yazilim-vip/cdc-with-debezium-kafka-spring-boot-3-and-postgres-a523d5237cca
2. https://medium.com/@htyesilyurt/spring-boot-debezium-for-change-data-capture-cdc-kafka-mysql-redis-cacheable-all-in-one-708ef5298cba
3. https://docs.spring.io/spring-integration/reference/debezium.html
4. https://debezium.io/documentation/reference/stable/tutorial.html?referrer=grok.com
5. https://debezium.io/documentation/reference/stable/integrations/serdes.html?referrer=grok.com