import { useState } from "react";
import axios from "axios";
import './chatBot.css';

interface Mensaje {
  texto: string;
  autor: "bot" | "user";
  opciones?: string[];
}

function ChatBot() {

  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
        texto: "Hola 👋 Soy el asistente virtual. ¿Qué deseas consultar?",
        autor: "bot",
        opciones: [
        "💻 Laptops",
        "🖥️ Monitores",
        "📦 Productos",
        "🕘 Horario",
        "💳 Métodos de pago"
        ]
    }
    ]);

  const enviarMensaje = async () => {

    if (!mensaje.trim()) return;

    const nuevoMensaje: Mensaje = {
      texto: mensaje,
      autor: "user"
    };

    setMensajes(prev => [...prev, nuevoMensaje]);

    const textoUsuario = mensaje.toLowerCase();

    setMensaje("");

    try {

      // 🔹 Respuestas rápidas locales
      if (textoUsuario.includes("hola")) {

        setMensajes(prev => [
          ...prev,
          {
            texto: "Hola 👋 ¿Qué deseas consultar?",
            autor: "bot"
          }
        ]);

        return;
      }

      if (textoUsuario.includes("horario")) {

        setMensajes(prev => [
          ...prev,
          {
            texto: "🕘 Atendemos de 9am a 8pm",
            autor: "bot"
          }
        ]);

        return;
      }

      if (
        textoUsuario.includes("laptop") ||
        textoUsuario.includes("precio") ||
        textoUsuario.includes("stock") ||
        textoUsuario.includes("producto") ||
        textoUsuario.includes("monitor") ||
        textoUsuario.includes("celular")
      ) {

        const res = await axios.post(
          "https://entregable-php.onrender.com/chatbot.php",
          {
            mensaje: textoUsuario
          }
        );

        setMensajes(prev => [
          ...prev,
          {
            texto: res.data.respuesta,
            autor: "bot"
          }
        ]);

        return;
      }

      // 🔹 Respuesta por defecto
      setMensajes(prev => [
        ...prev,
        {
          texto: "No entendí tu consulta 😅",
          autor: "bot"
        }
      ]);

    } catch (error) {

      setMensajes(prev => [
        ...prev,
        {
          texto: "❌ Error al consultar el servidor",
          autor: "bot"
        }
      ]);
    }
  };

  const seleccionarOpcion = async (opcion: string) => {

    const mensajeUsuario: Mensaje = {
        texto: opcion,
        autor: "user"
    };

    setMensajes(prev => [...prev, mensajeUsuario]);

    const texto = opcion.toLowerCase();

    // 🔹 Horario
    if (texto.includes("horario")) {

        setMensajes(prev => [
        ...prev,
        {
            texto: "🕘 Atendemos de 9am a 8pm",
            autor: "bot"
        }
        ]);

        return;
    }

    // 🔹 Métodos de pago
    if (texto.includes("pago")) {

        setMensajes(prev => [
        ...prev,
        {
            texto: "💳 Aceptamos Yape, Plin, Visa y Mastercard",
            autor: "bot"
        }
        ]);

        return;
    }

    // 🔹 Consultar backend
    try {

        const res = await axios.post(
        "https://entregable-php.onrender.com/chatbot.php",
        {
            mensaje: texto
        }
        );

        setMensajes(prev => [
        ...prev,
        {
            texto: res.data.respuesta,
            autor: "bot",
            opciones: [
            "💻 Laptops",
            "🖥️ Monitores",
            "📦 Productos"
            ]
        }
        ]);

    } catch (error) {

        setMensajes(prev => [
        ...prev,
        {
            texto: "❌ Error al consultar productos",
            autor: "bot"
        }
        ]);
    }
    };

  return (
    <>

      {/* 🔹 Botón flotante */}
      <button
        className="chat-float"
        onClick={() => setAbierto(!abierto)}
      >
        💬
      </button>

      {/* 🔹 Ventana */}
      <div className={`chat-container ${abierto ? 'open' : ''}`}>

        <div className="chat-header">
          <h3>Asistente Virtual</h3>
          <button onClick={() => setAbierto(false)}>✖</button>
        </div>

        <div className="chat-body">

          {mensajes.map((m, i) => (
            <div key={i}>

                <div className={`mensaje ${m.autor}`}>
                {m.texto}
                </div>

                {m.opciones && (
                <div className="opciones-chat">

                    {m.opciones.map((o, index) => (
                    <button
                        key={index}
                        className="btn-opcion"
                        onClick={() => seleccionarOpcion(o)}
                    >
                        {o}
                    </button>
                    ))}

                </div>
                )}

            </div>
            ))}

        </div>

        <div className="chat-footer">

          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                enviarMensaje();
              }
            }}
          />

          <button onClick={enviarMensaje}>
            Enviar
          </button>

        </div>

      </div>

    </>
  );
}

export default ChatBot;