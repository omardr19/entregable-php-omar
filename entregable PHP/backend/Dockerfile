FROM php:8.2-apache

# Instalar extensiones necesarias
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copiar tu proyecto al contenedor
COPY . /var/www/html/

# Configurar permisos para la carpeta de imágenes
RUN mkdir -p /var/www/html/IMG/productos && chmod -R 777 /var/www/html/IMG/productos

EXPOSE 10000
