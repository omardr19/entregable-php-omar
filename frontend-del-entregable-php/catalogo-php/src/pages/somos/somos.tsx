import Barra_navegacion from '../../components/Barra_navegacion';
import './quienessomos.css';

function QuienesSomos() {

  return (
    <>

      <Barra_navegacion />

      <section className="qs-hero">

        <div className="qs-overlay">

          <div className="qs-hero-content">
            <h1>Quiénes Somos</h1>
            <p>
              Tecnología, innovación y compromiso en un solo lugar.
            </p>
          </div>

        </div>

      </section>

      <section className="qs-container">

        <div className="qs-card historia">

          <div className="qs-texto">
            <span className="tag">Nuestra Historia</span>

            <h2>
              Una tienda creada para acercar la tecnología a todos
            </h2>

            <p>
              Somos una tienda especializada en productos tecnológicos,
              enfocada en ofrecer equipos modernos, componentes y accesorios
              de calidad para estudiantes, profesionales y entusiastas de la tecnología.
            </p>

            <p>
              Nuestro objetivo es brindar una experiencia de compra rápida,
              segura y moderna, permitiendo a nuestros clientes encontrar
              todo lo que necesitan en un solo lugar.
            </p>
          </div>

          <div className="qs-img-box">
            <img
              src="/IMG/banner_tecnologia.jpg"
              alt="Tecnología"
            />
          </div>

        </div>

        <div className="qs-valores">

          <div className="valor-card">
            <div className="icono">💻</div>
            <h3>Innovación</h3>
            <p>
              Trabajamos constantemente con productos modernos y actualizados.
            </p>
          </div>

          <div className="valor-card">
            <div className="icono">🛡️</div>
            <h3>Confianza</h3>
            <p>
              Garantizamos seguridad y transparencia en cada compra.
            </p>
          </div>

          <div className="valor-card">
            <div className="icono">⚡</div>
            <h3>Calidad</h3>
            <p>
              Seleccionamos cuidadosamente cada producto de nuestro catálogo.
            </p>
          </div>

        </div>

        <div className="qs-mision-vision">

          <div className="mv-card">
            <h2>Misión</h2>
            <p>
              Brindar soluciones tecnológicas accesibles y modernas,
              ofreciendo productos de calidad con una excelente atención.
            </p>
          </div>

          <div className="mv-card">
            <h2>Visión</h2>
            <p>
              Convertirnos en una de las tiendas tecnológicas más confiables
              y reconocidas del mercado.
            </p>
          </div>

        </div>

      </section>

    </>
  );
}

export default QuienesSomos;
