import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Barra_navegacion from '../components/Barra_navegacion';
import CarruselP from '../components/carrusel/CarruselP';

import './inicio.css';
import ChatBot from '../components/chatBot/ChatBot';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria_nombre: string;
}

function Inicio() {

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {

    const obtenerProductos = async () => {

      try {

        const response = await axios.get(
          "https://backend-omar-php.onrender.com/productos.php"
        );

        setProductos(response.data);

      } catch (error) {

        console.error("Error cargando productos:", error);

      } finally {

        setCargando(false);

      }
    };

    obtenerProductos();

  }, []);

  // 🔹 Agrupar productos por categoría
  const productosPorCategoria = productos.reduce(
    (acc: Record<string, Producto[]>, producto) => {

      const categoria = producto.categoria_nombre;

      if (!acc[categoria]) {
        acc[categoria] = [];
      }

      acc[categoria].push(producto);

      return acc;

    },
    {}
  );

  return (
    <>
      <Barra_navegacion />

      <div className='container'>

        {/* 🔹 Productos destacados */}
        <h2>Productos Destacados</h2>

        <CarruselP />

        {/* 🔹 Loading */}
        {cargando ? (
          <p className='loading'>Cargando productos...</p>
        ) : (

          Object.entries(productosPorCategoria).map(
            ([categoria, productosCategoria]) => (

              <div className="muestra_productos" key={categoria}>

                {/* 🔹 Título categoría */}
                <div className="categoria-header">

                  <h3>{categoria}</h3>

                  <Link
                    to={`/catalogo?categoria=${encodeURIComponent(categoria)}`}
                  >
                    Ver más
                  </Link>

                </div>

                {/* 🔹 Productos */}
                <div className="productos_muestra">

                  {productosCategoria
                    .slice(0, 4)
                    .map((producto) => (

                      <div className="card" key={producto.id}>

                        <img
                          src={`https://backend-omar-php.onrender.com/IMG/productos/${producto.imagen}`}
                          alt={producto.nombre}
                        />

                        <h3>{producto.nombre}</h3>

                        <p>
                          S/ {Number(producto.precio).toFixed(2)}
                        </p>

                        <button>Ver más</button>

                      </div>

                    ))}

                </div>

              </div>

            )
          )
        )}
        <ChatBot/>
      </div>
    </>
  );
}

export default Inicio;