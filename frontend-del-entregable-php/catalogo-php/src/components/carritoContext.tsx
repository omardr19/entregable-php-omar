import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<any>(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: any) => {

  const [carrito, setCarrito] = useState<any[]>([]);

  // 🔁 Cargar carrito
  useEffect(() => {
    const data = localStorage.getItem("carrito");
    if (data) setCarrito(JSON.parse(data));
  }, []);

  // 💾 Guardar carrito
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // ➕ Agregar
  const agregar = (producto: any) => {
    const existe = carrito.find(p => p.id === producto.id);

    if (existe) {
      setCarrito(carrito.map(p =>
        p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // ❌ Eliminar
  const eliminar = (id: number) => {
    setCarrito(carrito.filter(p => p.id !== id));
  };

  // 🔄 Cambiar cantidad
  const cambiarCantidad = (id: number, cantidad: number) => {
    setCarrito(carrito.map(p =>
      p.id === id ? { ...p, cantidad } : p
    ));
  };

  const limpiar = () => {
    setCarrito([]);
    localStorage.removeItem("carrito");
  };

  return (
    <CartContext.Provider value={{ carrito, agregar, eliminar, cambiarCantidad, limpiar }}>
      {children}
    </CartContext.Provider>
  );
};