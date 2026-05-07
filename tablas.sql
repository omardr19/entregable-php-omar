create database entregable_php;

use entregable_php;

create table roles(
id int not null primary key auto_increment,
nombre varchar(255) not null,
estado boolean default true
);

create table categoria(
id int not null primary key auto_increment,
nombre varchar(255) not null,
estado boolean default true
);

create table productoEstado(
id int not null primary key auto_increment,
nombre varchar(255) not null,
estado boolean default true
);

create table usuarios (
id int primary key not null auto_increment,
nombres varchar(255) not null,
apellidos varchar(255) not null,
nombre_usuario varchar(255) not null unique,
correo varchar(255) not null unique,
contrasena varchar(255) not null,
estado boolean default true
);

create table clientes(
id int not null primary key auto_increment,
id_usuario int not null unique,
fecha_Registro datetime default (current_timestamp()),
estado boolean default true,
foreign key (id_usuario) references usuarios(id)
on delete restrict
on update cascade
);

create table empleados(
id int not null primary key auto_increment,
id_usuario int not null unique,
rol int not null,
fecha_Registro datetime default (current_timestamp()),
estado boolean default true,
foreign key (id_usuario) references usuarios(id)
on delete restrict
on update cascade,
foreign key (rol) references roles(id) 
on delete restrict
on update cascade
);

create table productos(
id int not null primary key auto_increment,
nombre varchar(255) not null,
descripcion varchar(255) not null,
categoria int not null,
stock int not null,
precio decimal(10,2) not null,
imagen varchar(500),
estadoProduc int not null,
estado boolean default true,
foreign key (estadoProduc) references productoEstado(id)
on delete restrict
on update cascade,
foreign key (categoria) references categoria(id)
on delete restrict
on update cascade
);

create table boleta(
id int not null primary key auto_increment,
idCliente int not null,
idEmpleado int not null,
fechaEmision datetime default (current_timestamp()),
subtotal decimal(10,2) not null,
igv decimal(10,2) not null,
Ptotal decimal(10,2) not null,
foreign key (idCliente) references clientes(id)
on delete restrict
on update cascade,
foreign key (idEmpleado) references empleados(id)
on delete restrict
on update cascade
);

create table detalles_Boleta(
id int not null primary key auto_increment,
idBoleta int not null,
idProducto int not null,
cantidad int not null,
precio decimal(10,2) not null,
subtotal decimal(10,2) not null,
foreign key (idBoleta) references boleta(id)
on delete cascade
on update cascade,
foreign key (idProducto) references productos(id)
on delete restrict
on update cascade
);

/*procesos*/

DROP PROCEDURE IF EXISTS sp_agregar_detalle_boleta;

DELIMITER //

CREATE PROCEDURE sp_agregar_detalle_boleta(
    IN p_idBoleta INT,
    IN p_idProducto INT,
    IN p_cantidad INT,
    IN p_precio DECIMAL(10,2)
)
BEGIN

    DECLARE v_subtotal DECIMAL(10,2);
    DECLARE v_stock INT;

    /* Obtener stock actual */
    SELECT stock
    INTO v_stock
    FROM productos
    WHERE id = p_idProducto;

    /* Validar stock */
    IF p_cantidad > v_stock THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente';

    ELSE

        /* Calcular subtotal */
        SET v_subtotal = p_cantidad * p_precio;

        /* Insertar detalle */
        INSERT INTO detalles_Boleta(
            idBoleta,
            idProducto,
            cantidad,
            precio,
            subtotal
        )
        VALUES(
            p_idBoleta,
            p_idProducto,
            p_cantidad,
            p_precio,
            v_subtotal
        );

        /* Descontar stock */
        UPDATE productos
        SET stock = stock - p_cantidad
        WHERE id = p_idProducto;

    END IF;

END //

DELIMITER ;

delimiter //

create procedure sp_crear_boleta(
in p_idCliente int,
in p_idEmpleado int,
in p_subtotal decimal(10,2),
in p_igv decimal(10,2),
in p_total decimal(10,2)
)
begin
    insert into boleta(idCliente, idEmpleado, subtotal, igv, Ptotal)
    values(p_idCliente, p_idEmpleado, p_subtotal, p_igv, p_total);

    select last_insert_id() as id_boleta;
end //

delimiter ;

select * from detalles_Boleta;


INSERT INTO categoria (nombre) VALUES
('Laptops'),
('PC Escritorio'),
('Celulares'),
('Tablets'),
('Monitores'),
('Teclados'),
('Mouse'),
('Audífonos'),
('Impresoras'),
('Componentes');

INSERT INTO productoEstado (nombre) VALUES
('Disponible'),
('Agotado'),
('Descontinuado');

INSERT INTO productos (nombre, descripcion, categoria, stock, precio, estadoProduc)
VALUES 
(
'Laptop HP 15-fd2381la',
'Laptop HP con Intel Core Ultra 7, 24GB RAM, 1TB SSD, pantalla 15.6"',
1, 15, 3349.00, 1
),
(
'PC Gamer Ryzen 5',
'PC de escritorio con Ryzen 5, 16GB RAM, SSD 512GB, GPU RTX 3060',
2, 8, 4200.00, 1
),
(
'Smartphone Samsung Galaxy A54',
'Celular Samsung con 128GB almacenamiento, 8GB RAM, cámara 50MP',
3, 25, 1499.00, 1
),
(
'Monitor LG 24" IPS',
'Monitor LG Full HD 24 pulgadas, panel IPS, 75Hz',
5, 20, 650.00, 1
);
