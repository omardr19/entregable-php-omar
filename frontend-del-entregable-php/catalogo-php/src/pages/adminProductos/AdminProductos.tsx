import { useEffect, useState } from "react";
import axios from "axios";
import './adminproductos.css';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: number;
  categoria_nombre?: string;
  stock: number;
  precio: number;
  estadoProduc: number;
  imagen?: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

function AdminProductos() {

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [imagen, setImagen] = useState<File | null>(null);

  const [form, setForm] = useState<Producto>({
    id: 0,
    nombre: "",
    descripcion: "",
    categoria: 1,
    stock: 0,
    precio: 0,
    estadoProduc: 1,
    imagen: ""
  });

  const [editando, setEditando] = useState(false);

  // 🔹 Cargar productos y categorías
  const cargarDatos = async () => {

    try {

      const resProd = await axios.get(
        "https://backend-omar-php.onrender.com/productos.php"
      );

      const resCat = await axios.get(
        "https://backend-omar-php.onrender.com/categoria.php"
      );

      setProductos(resProd.data);
      setCategorias(resCat.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // 🔹 Manejar inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 Manejar imagen
  const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  // 🔹 Guardar
  const guardar = async () => {

    try {

      const formData = new FormData();

      formData.append("id", String(form.id));
      formData.append("nombre", form.nombre);
      formData.append("descripcion", form.descripcion);
      formData.append("categoria", String(form.categoria));
      formData.append("stock", String(form.stock));
      formData.append("precio", String(form.precio));
      formData.append("estadoProduc", String(form.estadoProduc));

      if (imagen) {
        formData.append("imagen", imagen);
      }

      if (editando) {

        await axios.post(
          "https://backend-omar-php.onrender.com/editarP.php",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

        alert("Producto actualizado");

      } else {

        await axios.post(
          "https://backend-omar-php.onrender.com/agregarP.php",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

        alert("Producto agregado");
      }

      limpiar();
      cargarDatos();

    } catch (error) {
      console.error(error);
      alert("Error");
    }
  };

  // 🔹 Editar producto
  const editar = (p: Producto) => {

    setForm(p);
    setEditando(true);
  };

  // 🔹 Eliminar
  const eliminar = async (id: number) => {

    try {

      await axios.post(
        "https://backend-omar-php.onrender.com/eliminarP.php",
        { id }
      );

      cargarDatos();

    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Limpiar
  const limpiar = () => {

    setForm({
      id: 0,
      nombre: "",
      descripcion: "",
      categoria: 1,
      stock: 0,
      precio: 0,
      estadoProduc: 1,
      imagen: ""
    });

    setImagen(null);
    setEditando(false);
  };

  return (

    <div className="admin-container">

      <div className="header-admin">
        <h1>⚙️ Panel de Productos</h1>
        <p>Gestiona productos, stock, imágenes y estados</p>
      </div>

      {/* 🔹 FORMULARIO */}
      <div className="card-admin form-card">

        <div className="form-header">
          <h2>
            {editando
              ? "✏️ Editar Producto"
              : "➕ Nuevo Producto"}
          </h2>
        </div>

        <div className="form-grid">

          <div className="input-box">
            <label>Nombre</label>

            <input
              type="text"
              name="nombre"
              placeholder="Nombre del producto"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="input-box">
            <label>Descripción</label>

            <input
              type="text"
              name="descripcion"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={handleChange}
            />
          </div>

          <div className="input-box">
            <label>Categoría</label>

            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
            >

              {categorias.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}

            </select>
          </div>

          <div className="input-box">
            <label>Stock</label>

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
            />
          </div>

          <div className="input-box">
            <label>Precio</label>

            <input
              type="number"
              name="precio"
              placeholder="Precio"
              value={form.precio}
              onChange={handleChange}
            />
          </div>

          <div className="input-box">
            <label>Estado</label>

            <select
              name="estadoProduc"
              value={form.estadoProduc}
              onChange={handleChange}
            >
              <option value={1}>Disponible</option>
              <option value={2}>Agotado</option>
            </select>
          </div>

          {/* 🔹 IMAGEN */}
          <div className="input-box full-width">

            <label>Imagen del producto</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImagen}
            />

          </div>

        </div>

        {/* 🔹 PREVIEW */}
        {imagen ? (
          <div className="preview-box">
            <p>Vista previa (nueva)</p>
            <img
              src={URL.createObjectURL(imagen)}
              alt="preview"
              className="preview-img"
            />
          </div>
        ) : form.imagen ? (
          <div className="preview-box">
            <p>Imagen registrada</p>
            <img
              src={`https://backend-omar-php.onrender.com/IMG/productos/${form.imagen}`}
              alt={form.nombre}
              className="preview-img"
            />
          </div>
        ) : null}

        {/* 🔹 BOTONES */}
        <div className="buttons-admin">

          <button
            className="btn btn-primary"
            onClick={guardar}
          >
            {editando
              ? "Actualizar Producto"
              : "Crear Producto"}
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

      {/* 🔹 TABLA */}
      <div className="card-admin table-card">

        <div className="table-header">
          <h2>📦 Lista de Productos</h2>
        </div>

        <div className="table-wrapper">

          <table className="table">

            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {productos.map(p => (

                <tr key={p.id}>

                  <td>{p.nombre}</td>

                  <td>{p.categoria_nombre}</td>

                  <td>{p.stock}</td>

                  <td>S/ {Number(p.precio).toFixed(2)}</td>

                  <td>

                    {p.estadoProduc === 1 ? (
                      <span className="badge badge-green">
                        Disponible
                      </span>
                    ) : (
                      <span className="badge badge-red">
                        Agotado
                      </span>
                    )}

                  </td>

                  <td className="actions">

                    <button
                      className="btn btn-warning"
                      onClick={() => editar(p)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => eliminar(p.id)}
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

    </div>
  );
}

export default AdminProductos;