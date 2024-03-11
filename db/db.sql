CREATE DATABASE IF NOT EXISTS nodejs_base1;

USE nodejs_base1;

CREATE TABLE users(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(180) NOT NULL UNIQUE,
    name VARCHAR(90) NOT NULL,
    lastname VARCHAR(90) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    image VARCHAR(255) NULL,
    password VARCHAR(150) NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);

CREATE TABLE roles(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(100) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	route VARCHAR(180) NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

INSERT INTO roles(name, route, created_at, updated_at) VALUES
	('RESTAURANTE', '/restaurant/orders/list', NOW(), NOW()),
	('REPARTIDOR', '/delivery/orders/list', NOW(), NOW()),
	('CLIENTE', '/client/products/list', NOW(), NOW());

CREATE TABLE user_has_roles(
	id_user BIGINT NOT NULL,
	id_rol BIGINT NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY(id_user, id_rol)
);		

USE nodejs_base1;

CREATE TABLE roles(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(100) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	route VARCHAR(180) NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

INSERT INTO roles(name, route, created_at, updated_at) VALUES
	('RESTAURANTE', '/restaurant/orders/list', NOW(), NOW()),
	('REPARTIDOR', '/delivery/orders/list', NOW(), NOW()),
	('CLIENTE', '/client/products/list', NOW(), NOW());

CREATE TABLE user_has_roles(
	id_user BIGINT NOT NULL,
	id_rol BIGINT NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY(id_user, id_rol)
);

SELECT 
	U.id, 
	U.email, 
	U.name, 
	U.lastname,
	U.phone,
	U.image,
	U.password,
	JSON_ARRAYAGG(
		JSON_OBJECT(
		'id', R.id,
		'name', R.name,
		'image', R.image,
		'route', R.route
		)
	) AS roles
FROM users AS U
INNER JOIN user_has_roles AS UHR 
	ON UHR.id_user = U.id
INNER JOIN roles AS R 
	ON UHR.id_rol = r.id
WHERE
	email = 'luispe@gmail.com' -- Para probar reemplace  por el correo del usuario

