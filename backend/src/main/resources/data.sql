-- 1. Simple INSERT (single row)
INSERT INTO "order" (product_name, quantity, last_modified_datetime) VALUES ('Laptop', 2, NULL);
INSERT INTO "order" (product_name, quantity, last_modified_datetime) VALUES ('Smartphone', 5, NULL);

INSERT INTO "order" (product_name, quantity)
VALUES ('Laptop', 3);

-- 2. INSERT with a different product and higher quantity
INSERT INTO "order" (product_name, quantity)
VALUES ('Wireless Mouse', 25);

-- 3. INSERT overriding one default timestamp (for demonstration)
INSERT INTO "order" (product_name, quantity, created_datetime)
VALUES ('Mechanical Keyboard', 8, '2026-01-01 10:00:00+08');

-- 4. Multi-row INSERT
INSERT INTO "order" (product_name, quantity)
VALUES
    ('4K Monitor', 4),
    ('USB-C Hub', 15),
    ('Webcam', 7);

-- 5. UPDATE quantity for a specific product
UPDATE "order"
SET quantity = 35,
    last_modified_datetime = CURRENT_TIMESTAMP
WHERE product_name = 'Wireless Mouse';

-- 6. UPDATE product name and timestamp using primary key
UPDATE "order"
SET product_name = 'Gaming Mouse Pro',
    last_modified_datetime = CURRENT_TIMESTAMP
WHERE id = 2;

-- 7. UPDATE with arithmetic on quantity and conditional on current quantity
UPDATE "order"
SET quantity = quantity - 5,
    last_modified_datetime = CURRENT_TIMESTAMP
WHERE quantity > 10;

-- 8. UPDATE setting quantity to zero (e.g., marking as out of stock)
UPDATE "order"
SET quantity = 0,
    last_modified_datetime = CURRENT_TIMESTAMP
WHERE product_name = 'USB-C Hub';

-- 9. DELETE a single row by primary key
DELETE FROM "order"
WHERE id = 1;

-- 10. DELETE multiple rows based on a condition
DELETE FROM "order"
WHERE quantity <= 5
  AND created_datetime < CURRENT_TIMESTAMP - INTERVAL '30 days';