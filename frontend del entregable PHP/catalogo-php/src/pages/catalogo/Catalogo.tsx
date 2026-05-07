import { useEffect, useState } from 'react';
import axios from 'axios';
import Barra_navegacion from '../../components/Barra_navegacion';
import { useCart } from "../../components/carritoContext";
import './catalogo.css';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria_nombre: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

function Catalogo() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
    const [cargando, setCargando] = useState(true);
    const { agregar } = useCart();


    useEffect(() => {
            const fetchData = async () => {
                try {
                    console.log("Intentando cargar productos...");
                    const resProd = await axios.get("http://localhost:3000/backend/productos.php");
                    setProductos(resProd.data);
                    console.log("Productos cargados:", resProd.data);

                    console.log("Intentando cargar categorías...");
                    const resCat = await axios.get("http://localhost:3000/backend/categoria.php");
                    setCategorias(resCat.data);
                    console.log("Categorías cargadas:", resCat.data);

                } catch (error) {
                    console.error("Error detallado:", error);
                } finally {
                    setCargando(false);
                }
            };
            fetchData();
        }, []);

    // Lógica de filtrado combinada (Buscador + Categoría)
    const productosFiltrados = productos.filter(prod => {
        const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = categoriaSeleccionada === "Todos" || prod.categoria_nombre === categoriaSeleccionada;
        return coincideBusqueda && coincideCategoria;
    });

    return (
        <>
            <Barra_navegacion />
        
            <section className="catalogo-wrapper">

                {/* HEADER */}
                <div className="catalogo-header">
                <h1 className="main-title">Catálogo de Productos</h1>

                <div className="filter-controls">

                    {/* BUSCADOR */}
                    <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    </div>

                    {/* CATEGORÍAS */}
                    <div className="category-nav">
                    <button
                        className={`cat-btn ${categoriaSeleccionada === "Todos" ? "active" : ""}`}
                        onClick={() => setCategoriaSeleccionada("Todos")}
                    >
                        Todos
                    </button>

                    {categorias.map(cat => (
                        <button
                        key={cat.id}
                        className={`cat-btn ${categoriaSeleccionada === cat.nombre ? "active" : ""}`}
                        onClick={() => setCategoriaSeleccionada(cat.nombre)}
                        >
                        {cat.nombre}
                        </button>
                    ))}
                    </div>

                </div>
                </div>

                {/* PRODUCTOS */}
                <div className="products-grid">
                {productosFiltrados.length > 0 ? (
                    productosFiltrados.map(prod => (
                    <div className="product-card" key={prod.id}>

                        <div className="image-container">
                        <span className="category-tag">{prod.categoria_nombre}</span>
                        <img src={`http://localhost:3000/IMG/productos/${prod.imagen}`} alt={prod.nombre} />
                        </div>

                        <div className="product-details">
                        <h3 className="product-title">{prod.nombre}</h3>

                        <div className="price-row">
                            <span className="price">
                            S/ {Number(prod.precio).toLocaleString("es-PE")}
                            </span>

                            <button className="add-btn" onClick={() => agregar(prod)}>
                            <span className="plus-icon">+</span>
                            </button>
                        </div>
                        </div>

                    </div>
                    ))
                ) : (
                    <p className="no-results">No se encontraron productos.</p>
                )}
                </div>

            </section>
        </>
    );
}

export default Catalogo;