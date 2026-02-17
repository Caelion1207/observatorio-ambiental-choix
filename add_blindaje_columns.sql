ALTER TABLE investigaciones 
ADD COLUMN versionProtocolo VARCHAR(20) DEFAULT '1.0' NOT NULL,
ADD COLUMN fechaCierreSemantico TIMESTAMP NULL,
ADD COLUMN supuestosEstructurados TEXT NULL,
ADD COLUMN indiceRobustez DECIMAL(3,2) DEFAULT 0.00;
