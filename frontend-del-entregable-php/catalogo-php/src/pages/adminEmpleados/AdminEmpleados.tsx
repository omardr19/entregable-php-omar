import { useEffect, useState } from "react";
import axios from "axios";
import './adminEmpleados.css';

interface Empleado {
  id: number;
  nombres: string;
  apellidos: string;
  nombre_usuario: string;
  correo: string;
  rol: number;
}

interface Rol {
  id: number;
  nombre: string;
}

function AdminEmpleados() {

  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);

  const [form, setForm] = useState({
    id: 0,
    nombres: "",
    apellidos: "",
    usuario: "",
    correo: "",
    contrasena: "",
    rol: ""
  });

  const [editando, setEditando] = useState(false);

  const cargarEmpleados = async () => {

     try {

      const res = await axios.get(
        "https://backend-omar-php.onrender.com/empleados.php"
      );

      const resRoles = await axios.get(
        "https://backend-omar-php.onrender.com/roles.php"
      );

      setEmpleados(res.data);
      setRoles(resRoles.data);

    setEmpleados(res.data);
    } catch (error) {

      console.error(error);

    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const guardar = async () => {









    try {

     if (editando) {

await axios.post(
          "https://backend-omar-php.onrender.com/editarEmpleado.php",
          form
        );


      alert("Empleado actualizado");

     } else {

        await axios.post(
          "https://backend-omar-php.onrender.com/agregarUsuario.php",
          {
            ...form,
            tipo: "empleado"
          }
        );

        alert("Empleado registrado");
      }

      limpiar();
      cargarEmpleados();

    } catch (error) {

      console.error(error);
      alert("Error");

    }
  };

  const editar = (e: Empleado) => {

    setForm({
      id: e.id,
      nombres: e.nombres,
      apellidos: e.apellidos,
      usuario: e.nombre_usuario,
      correo: e.correo,
      contrasena: "",
      rol: String(e.rol)
    });

    setEditando(true);
  };

  const eliminar = async (id: number) => {



    try {

    await axios.post(
        "https://backend-omar-php.onrender.com/eliminarEmpleado.php",
        { id }
      );

      cargarEmpleados();

    } catch (error) {

      console.error(error);

    }
  };

  const limpiar = () => {

    setForm({
      id: 0,
      nombres: "",
      apellidos: "",
      usuario: "",
      correo: "",
      contrasena: "",
      rol: ""
    });

    setEditando(false);
  };

  return (
    <div className="admin-container">

      <h2 className="admin-title">
        👨‍💼 Gestión de Empleados
      </h2>

      <div className="card-admin">

        <div className="form-grid">

          <input
            type="text"
            name="nombres"
            placeholder="Nombres"
            value={form.nombres}
            onChange={handleChange}
          />

          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            value={form.apellidos}
            onChange={handleChange}
          />

          <input
            type="text"
            name="usuario"
            placeholder="Usuario"
            value={form.usuario}
            onChange={handleChange}
          />

          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={form.correo}
            onChange={handleChange}
          />

          {!editando && (
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={handleChange}
            />
          )}

          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
          >

            <option value="">
              Seleccionar Rol
            </option>

            {roles.map((r) => (

              <option
                key={r.id}
                value={r.id}
              >
                {r.nombre}
              </option>

            ))}

          </select>


        </div>

        <div className="buttons-admin">

          <button
            className="btn btn-primary"
            onClick={guardar}
          >
            {
              editando
                ? "Actualizar Empleado"
                : "Registrar Empleado"
            }
          </button>

          {editando && (

            <button
              className="btn btn-secondary"
              onClick={limpiar}
            >
              Cancelar
            </button>

          )}

        </div>

      </div>

      <div className="card-admin">

        <table className="table">

          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Cargo</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {empleados.map((e) => (

              <tr key={e.id}>

                <td>
                  {e.nombres} {e.apellidos}
                </td>

                <td>
                  {e.nombre_usuario}
                </td>

                <td>
                  {e.correo}
                </td>

                <td>
                  <span className="badge badge-blue">
                    {
                      roles.find(
                        (r) => r.id === Number(e.rol)
                      )?.nombre || "Sin rol"
                    }
                  </span>
                </td>

                <td className="actions">

                  <button
                    className="btn btn-warning"
                    onClick={() => editar(e)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => eliminar(e.id)}
                  >
                    Eliminar
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminEmpleados;