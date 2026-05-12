import { useEffect, useState } from "react";
import axios from "axios";
import './adminEmpleados.css';

interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  nombre_usuario: string;
  correo: string;
}

function AdminClientes() {

  const [clientes, setClientes] = useState<Cliente[]>([]);

  const cargarClientes = async () => {

    const res = await axios.get(
      "https://backend-omar-php.onrender.com/clientes.php"
    );

    setClientes(res.data);
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  return (

    <div className="admin-container">

      <h2 className="admin-title">
        👥 Clientes Registrados
      </h2>

      <div className="card-admin">

        <table className="table">

          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Correo</th>
            </tr>
          </thead>

          <tbody>

            {clientes.map((c) => (

              <tr key={c.id}>

                <td>
                  {c.nombres} {c.apellidos}
                </td>

                <td>{c.nombre_usuario}</td>

                <td>{c.correo}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminClientes;