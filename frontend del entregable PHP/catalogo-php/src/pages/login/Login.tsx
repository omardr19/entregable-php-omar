import React, { useState } from 'react'
import './login.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 

        try {
            const response = await axios.post("http://localhost:3000/backend/login.php", {
                usuario: usuario,
                contrasena: password,
            });

            // Ahora verás esto en la consola sin que desaparezca
            console.log("Datos recibidos del PHP:", response.data);

            if (response.data.success) {
                // Guardamos la información necesaria
                localStorage.setItem('nombreUsuario', response.data.nombre);
                localStorage.setItem('esEmpleado', JSON.stringify(response.data.esEmpleado));
                localStorage.setItem('idUsuario', response.data.idUsuario);
                localStorage.setItem('idCliente', response.data.idCliente);
                
                alert(`¡Bienvenido ${response.data.nombre}!`);
                
                // Ya puedes habilitar el navigate con confianza
                navigate('/inicio'); 
            } else {
                alert(response.data.mensaje);
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error detallado:", error.response?.data);
                alert("Error de conexión con el servidor");
            }
        }
    };

    return (
        <section className='p_login'>
            <div className="container_login">
                <div className="login-box">
                    <h2>Bienvenido</h2>
                    <p className="subtitle">Inicia sesión en tu cuenta</p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input type="text" value={usuario} name="usuario" onChange={(e) => setUsuario(e.target.value)} required />
                            <label>Usuario</label>
                        </div>

                        <div className="input-group">
                            <input type="password" value={password} name="contrasena" onChange={(e) => setPassword(e.target.value)} required />
                            <label>Contraseña</label>
                        </div>

                        <button type="submit">Ingresar</button>
                    </form>
                    <p>
                        ¿No tienes cuenta? 
                        <span onClick={() => navigate("/registrar")}> Regístrate</span>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Login