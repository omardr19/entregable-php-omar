import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './barra_navegacion.css'
import CarritoSidebar from './carrito/carrito';

function Barra_navegacion() {

    const [openCart, setOpenCart] = useState(false);
    const [openUser, setOpenUser] = useState(false);

    const [usuario, setUsuario] = useState<string | null>(null);
    const [esEmpleado, setEsEmpleado] = useState(false);

    const navigate = useNavigate();

    // 🔹 Cargar sesión
    useEffect(() => {
        const nombre = localStorage.getItem("nombreUsuario");
        const empleado = localStorage.getItem("esEmpleado");

        setUsuario(nombre);
        setEsEmpleado(empleado === "true");
    }, []);

    // 🔹 Cerrar sesión
    const cerrarSesion = () => {
        localStorage.clear();
        setUsuario(null);
        setEsEmpleado(false);
        setOpenUser(false);
        navigate("/inicio");
    };

    return (
        <>
            <nav className="navbar">

                <div className="logo">
                    <Link to="/inicio">
                        <img src="/logo_prueba.png" alt="logo" />
                    </Link>
                </div>

                <div className="nav-links">
                    <Link to="/inicio">Inicio</Link>
                    <Link to="/catalogo">Productos</Link>
                    <Link to="/quienesSomos">¿Quienes Somos?</Link>
                </div>

                <div className="nav-icons">

                    {/* 🔥 BOTÓN SOLO PARA EMPLEADO */}
                    {esEmpleado && (
                        <>
                            <div className="admin_btn">
                                <Link to="/admin">
                                    <img src="/ajuste.png" alt="Usuario" />
                                </Link>
                            </div>
                            <div className="admin_btn">
                                <Link to="/admin/boletas"><img src="/boleta.png" alt="Usuario" /></Link>
                            </div>
                        </>
                    )}

                    {/* 🛒 CARRITO */}
                    <div className="carrito_btn">
                        <Link to="#" onClick={() => setOpenCart(true)}>
                            <img src="/carrito.png" alt="Carrito" />
                        </Link>
                    </div>

                    {/* 👤 USUARIO */}
                    <div className="inicio_sesion">

                        {!usuario ? (
                            <Link to="/login">
                                <img src="/usuario.png" alt="Usuario" />
                            </Link>
                        ) : (
                            <div className="user-menu">

                                <img
                                    src="/usuario.png"
                                    alt="Usuario"
                                    onClick={() => setOpenUser(!openUser)}
                                />

                                {openUser && (
                                    <div className="dropdown">

                                        <p>👋 {usuario}</p>

                                        <button onClick={cerrarSesion}>
                                            Cerrar sesión
                                        </button>

                                    </div>
                                )}

                            </div>
                        )}

                    </div>

                </div>
            </nav>

            <CarritoSidebar
                abierto={openCart}
                cerrar={() => setOpenCart(false)}
            />
        </>
    );
};

export default Barra_navegacion;