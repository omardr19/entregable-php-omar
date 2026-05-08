import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './resgistrar.css';

function Registrar() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    usuario: "",
    correo: "",
    contrasena: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        "https://entregable-php.onrender.com/agregarUsuario.php",
        {
          ...form,
          tipo: "cliente" // 👈 FORZAMOS CLIENTE
        }
      );

      if (response.data.success) {
        alert("Usuario registrado correctamente ✅");
        navigate("/login");
      } else {
        alert(response.data.mensaje);
      }

    } catch (error) {
      console.error(error);
      alert("Error en el servidor");
    }
  };

  return (
    <section className="registro-container">

      <div className="registro-box">
        <h2>Crear cuenta</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="nombres"
            placeholder="Nombres"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="usuario"
            placeholder="Usuario"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="correo"
            placeholder="Correo"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />

          <button type="submit">Registrarse</button>

        </form>

        <p>
          ¿Ya tienes cuenta? 
          <span onClick={() => navigate("/login")}> Inicia sesión</span>
        </p>

      </div>

    </section>
  );
}

export default Registrar;