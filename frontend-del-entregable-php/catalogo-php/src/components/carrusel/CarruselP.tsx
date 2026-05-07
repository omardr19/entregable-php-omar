import { useEffect, useState } from 'react';
import axios from 'axios';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import './carrusel.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
}

function CarruselP() {

  const [productosDestacados, setProductosDestacados] = useState<Producto[]>([]);

  useEffect(() => {

    const obtenerProductos = async () => {

      try {

        const response = await axios.get(
          "http://localhost:3000/backend/productos.php"
        );

        // 🔹 Tomamos algunos productos para el carrusel
        setProductosDestacados(response.data.slice(0, 5));

      } catch (error) {
        console.error("Error al cargar productos:", error);
      }

    };

    obtenerProductos();

  }, []);

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false
        }}
        loop={true}
        className="mySwiper"
      >

        {productosDestacados.map((item) => (

          <SwiperSlide key={item.id}>

            <div className="producto">

              <div className="producto-info">

                <span className="tag-destacado">
                  Producto Destacado
                </span>

                <h3>{item.nombre}</h3>

                <div className="precio">
                  S/ {Number(item.precio).toLocaleString('es-PE')}
                </div>

                <button className="btn-comprar-slider">
                  Ver producto
                </button>

              </div>

              <div className="producto-img">

                <img
                  src={`http://localhost:3000/IMG/productos/${item.imagen}`}
                  alt={item.nombre}
                />

              </div>

            </div>

          </SwiperSlide>

        ))}

      </Swiper>
    </>
  );
}

export default CarruselP;