CREATE TABLE `datosAbiertos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo` varchar(500) NOT NULL,
	`descripcion` text NOT NULL,
	`tipo` enum('csv','enlace','imagen_satelital') NOT NULL,
	`archivoUrl` text,
	`archivoKey` text,
	`enlaceExterno` text,
	`fuenteOficial` varchar(255) NOT NULL,
	`fechaDatos` timestamp,
	`investigacionId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `datosAbiertos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fuentesOficiales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`siglas` varchar(50) NOT NULL,
	`descripcion` text NOT NULL,
	`sitioWeb` text,
	`tiposDatos` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fuentesOficiales_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `investigaciones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo` varchar(500) NOT NULL,
	`slug` varchar(500) NOT NULL,
	`resumenEjecutivo` text NOT NULL,
	`contexto` text NOT NULL,
	`datosOficiales` text NOT NULL,
	`metodologia` text NOT NULL,
	`analisisTecnico` text NOT NULL,
	`proyeccion` text NOT NULL,
	`escenariosAlternativos` text NOT NULL,
	`limitaciones` text NOT NULL,
	`conclusiones` text NOT NULL,
	`fuentes` text NOT NULL,
	`publicada` boolean NOT NULL DEFAULT false,
	`autorId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`publishedAt` timestamp,
	CONSTRAINT `investigaciones_id` PRIMARY KEY(`id`),
	CONSTRAINT `investigaciones_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `participaciones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoria` enum('correccion_datos','nueva_fuente','aclaracion_tecnica','pregunta_metodologica') NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`asunto` varchar(500) NOT NULL,
	`contenido` text NOT NULL,
	`investigacionId` int,
	`estado` enum('pendiente','revisada','respondida') NOT NULL DEFAULT 'pendiente',
	`respuesta` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `participaciones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visualizaciones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo` varchar(500) NOT NULL,
	`tipo` enum('grafica_hidrologica','mapa_forestal','serie_tiempo') NOT NULL,
	`descripcion` text NOT NULL,
	`datosJson` text NOT NULL,
	`fuenteOficial` varchar(255) NOT NULL,
	`investigacionId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `visualizaciones_id` PRIMARY KEY(`id`)
);
