ALTER TABLE event_config 
ALTER COLUMN structure TYPE varchar USING structure::text;