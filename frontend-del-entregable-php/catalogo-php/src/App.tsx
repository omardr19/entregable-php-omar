import { Route, Routes, Navigate } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Login from './pages/login/Login';
import Catalogo from './pages/catalogo/Catalogo';
import AdminProductos from './pages/adminProductos/AdminProductos';
import AdminBoletas from './pages/adminBoletas/AdminBoletas';
import Registrar from './pages/registrar/Registrar';
import QuienesSomos from './pages/somos/somos';

function App() {
  return (
      <Routes>
        {/* Redirige la raíz a /inicio */}
        <Route path='/' element={<Navigate to="/inicio" replace />} />
        
        <Route path='/inicio' element={<Inicio />} />
        <Route path='/login' element={<Login />} />
        <Route path='/catalogo' element={<Catalogo />} />
        <Route path="/admin" element={<AdminProductos />} />
        <Route path="/admin/boletas" element={<AdminBoletas />} />  
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/quienesSomos" element={<QuienesSomos />} />

        {/* Ruta de captura por si escribes mal la URL */}
        <Route path="*" element={<div>404 - No encontrado</div>} />
      </Routes>
  );
}

export default App;