import { useEffect, useState } from "react";
import axios from "axios";
import './adminboletas.css'

interface Boleta {
  id: number;
  cliente: string;
  subtotal: number;
  igv: number;
  Ptotal: number;
  fechaEmision: string;
}

interface Detalle {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

function AdminBoletas() {

  const [boletas, setBoletas] = useState<Boleta[]>([]);
  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [boletaSeleccionada, setBoletaSeleccionada] = useState<number | null>(null);

  // 🔹 Cargar boletas
  const cargarBoletas = async () => {
    const res = await axios.get("http://localhost:3000/backend/boletas.php");
    setBoletas(res.data);
  };

  // 🔹 Cargar detalles
  const verDetalles = async (id: number) => {
    const res = await axios.get(`http://localhost:3000/backend/detallesBoleta.php?idBoleta=${id}`);
    setDetalles(res.data);
    setBoletaSeleccionada(id);
  };

  useEffect(() => {
    cargarBoletas();
  }, []);

  return (
    <div className="admin-container">

      <h2 className="admin-title">📄 Historial de Boletas</h2>

      <div className="card-admin">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {boletas.map(b => (
              <tr key={b.id}>
                <td>#{b.id}</td>
                <td>{b.cliente}</td>
                <td>S/ {b.Ptotal}</td>
                <td>{b.fechaEmision}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => verDetalles(b.id)}>
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {boletaSeleccionada && (
        <div className="card-admin detalle-box">

          <h3>🧾 Detalle Boleta #{boletaSeleccionada}</h3>

          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {detalles.map(d => (
                <tr key={d.id}>
                  <td>{d.nombre}</td>
                  <td>{d.cantidad}</td>
                  <td>S/ {d.precio}</td>
                  <td>S/ {d.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}

    </div>
  );
}

export default AdminBoletas;