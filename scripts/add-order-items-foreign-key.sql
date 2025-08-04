ALTER TABLE order_items
ADD CONSTRAINT fk_order_id
FOREIGN KEY (order_id)
REFERENCES orders(id)
ON DELETE CASCADE; -- Опционально: удалять элементы заказа при удалении самого заказа
