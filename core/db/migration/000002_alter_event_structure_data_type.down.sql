ALTER TABLE event_config 
ALTER COLUMN structure TYPE json USING structure::json;