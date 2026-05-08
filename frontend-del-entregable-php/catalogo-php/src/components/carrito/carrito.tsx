import { useCart } from "../carritoContext";
import { useNavigate } from "react-router-dom";
import './carrito.css';

// 🔹 Tipo del producto en carrito
interface ProductoCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
  stock: number;
}

// 🔹 Tipado de props
interface Props {
  abierto: boolean;
  cerrar: () => void;
}

function CarritoSidebar({ abierto, cerrar }: Props) {

  const { carrito, eliminar, cambiarCantidad, limpiar } = useCart();
  const navigate = useNavigate();

  const usuario = localStorage.getItem("nombreUsuario");

  // 🔹 Total del carrito
  const total = carrito.reduce(
    (acc: number, p: ProductoCarrito) =>
      acc + p.precio * p.cantidad,
    0
  );

  const comprar = async () => {

    const idCliente = localStorage.getItem("idCliente");

    // 🔹 Validar login
    if (!idCliente) {
      alert("Debes iniciar sesión");
      return;
    }

    // 🔹 Validar carrito vacío
    if (carrito.length === 0) {
      alert("Carrito vacío");
      return;
    }

    // 🔹 Validar stock ANTES de comprar
    const productoSinStock = carrito.find(
      (p: ProductoCarrito) => p.cantidad > p.stock
    );

    if (productoSinStock) {

      alert(
        `El producto "${productoSinStock.nombre}" excede el stock disponible`
      );

      return;
    }

    const subtotal = carrito.reduce(
      (acc: number, p: ProductoCarrito) =>
        acc + p.precio * p.cantidad,
      0
    );

    const igv = subtotal * 0.18;
    const totalFinal = subtotal + igv;

    try {

      // 🔹 1 Crear boleta
      const resBoleta = await fetch(
        "https://entregable-php.onrender.com/crearBoleta.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            idCliente: Number(idCliente),
            idEmpleado: 1,
            subtotal,
            igv,
            totalFinal
          })
        }
      );

      const dataBoleta = await resBoleta.json();

      if (!dataBoleta.success) {
        alert("Error al crear boleta");
        return;
      }

      // 🔹 2 Insertar detalles
      const resDetalle = await fetch(
        "https://entregable-php.onrender.com/agregarDetalleB.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            idBoleta: dataBoleta.id_boleta,
            productos: carrito
          })
        }
      );

      const dataDetalle = await resDetalle.json();

      if (!dataDetalle.success) {
        alert("Error al registrar detalles");
        return;
      }

      // 🔹 3 Enviar correo
      await fetch(
        "https://entregable-php.onrender.com/enviarBoleta.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            idBoleta: dataBoleta.id_boleta
          })
        }
      );

      alert("Compra realizada correctamente ✅");

      // 🔹 Limpiar carrito
      limpiar(); // limpia estado y localStorage
      cerrar();  // opcional: cerrar el sidebar después de comprar


    } catch (error) {

      console.error(error);

      alert("Error en la compra");

    }
  };

  return (
    <div className={`sidebar ${abierto ? "open" : ""}`}>

      {/* 🔹 Botón cerrar */}
      <button
        className="btn-cerrar"
        onClick={cerrar}
      >
        ✖
      </button>

      {/* 🔹 Si NO hay sesión */}
      {!usuario ? (

        <div className="no-login">

          <p>
            Debes iniciar sesión para ver tu carrito
          </p>

          <button onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>

        </div>

      ) : (

        <>
          <h2>🛒 Carrito</h2>

          {/* 🔹 Carrito vacío */}
          {carrito.length === 0 ? (

            <p className="carrito-vacio">
              Tu carrito está vacío
            </p>

          ) : (

            carrito.map((p: ProductoCarrito) => (

              <div key={p.id} className="item">

                <img
                  src={`https://entregable-php.onrender.com/IMG/productos/${p.imagen}`}
                  alt={p.nombre}
                />

                <div className="info">

                  <p className="nombre">
                    {p.nombre}
                  </p>

                  <p className="precio">
                    S/ {p.precio}
                  </p>

                  <input
                    type="number"
                    value={p.cantidad}
                    min="1"
                    max={p.stock}
                    onChange={(e) => {

                      const cantidad = Number(e.target.value);

                      // 🔹 Validar mínimo
                      if (cantidad < 1) {
                        return;
                      }

                      // 🔹 Validar stock
                      if (cantidad > p.stock) {

                        alert(
                          `Solo hay ${p.stock} unidades disponibles`
                        );

                        return;
                      }

                      cambiarCantidad(
                        p.id,
                        cantidad
                      );
                    }}
                  />

                  <p className="subtotal">
                    Subtotal:
                    S/ {(p.precio * p.cantidad).toFixed(2)}
                  </p>

                  <button
                    className="btn-eliminar"
                    onClick={() => eliminar(p.id)}
                  >
                    Eliminar
                  </button>

                </div>

              </div>

            ))

          )}

          {/* 🔹 Footer */}
          <div className="footer-carrito">

            <h3>
              Total: S/ {total.toFixed(2)}
            </h3>

            <button
              className="btn-comprar"
              onClick={comprar}
            >
              Comprar
            </button>

          </div>
        </>
      )}

    </div>
  );
}

export default CarritoSidebar;