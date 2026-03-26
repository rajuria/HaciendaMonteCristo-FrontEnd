import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function ProductoCard({ producto, onAgregarAlCarrito }) {
  const [imagenUrl, setImagenUrl] = useState(null)

  useEffect(() => {
    const fetchImagen = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/images/get/${producto.productID}`);
        const json = await response.json();

        if (response.ok && json.data && json.data.length > 0) {
          const objetoImagen = json.data; 
          
          if (objetoImagen && objetoImagen[0] && objetoImagen[0].image) {
            setImagenUrl(objetoImagen[0].image); 
          }
        }
      } catch (error) {
        console.error(`Error de red al cargar imagen para ${producto.productID}:`, error);
      }
    };

    fetchImagen();
  }, [producto.productID]);

  return (
    <div className="product-card">
      <div className="product-image-container" style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '15px', overflow: 'hidden' }}>
        {imagenUrl ? (
          <img src={imagenUrl} alt={producto.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '3rem' }}>📦</span>
        )}
      </div>
      
      <h3 className="product-title">{producto.name}</h3>

      <div className="product-row">
        <div className="product-price">L. {Number(producto.currentPrice).toFixed(2)}</div>
        <span className="badge badge-stock">Stock: {producto.currentStock}</span>
      </div>

      <button
        className="btn btn-green btn-block"
        onClick={() => onAgregarAlCarrito(producto)}
      >
        🛒 Agregar al Carrito
      </button>
    </div>
  )
}

// Componente Principal de la Página
export default function ClienteProductosPage() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/get/stock`);
        const json = await response.json();
        
        if (response.ok) {
          setProductos(json.data);
        } else {
          console.error('Error al cargar catálogo:', json.error);
        }
      } catch (error) {
        console.error('Error de red:', error);
      } finally {
        setCargando(false);
      }
    };

    fetchProductos();
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('usuario')
    navigate('/')
  }

  const agregarAlCarrito = (producto) => {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || []

    const productoExistente = carritoActual.find((item) => item.productID === producto.productID)

    let nuevoCarrito

    if (productoExistente) {
      nuevoCarrito = carritoActual.map((item) =>
        item.productID === producto.productID
          ? {
              ...item,
              cantidad: item.cantidad + 1 <= item.currentStock ? item.cantidad + 1 : item.cantidad,
            }
          : item
      )
    } else {
      nuevoCarrito = [...carritoActual, { ...producto, cantidad: 1 }]
    }

    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito))
    navigate('/cliente/carrito')
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand green">
            <h1>Hacienda Montecristo</h1>
            <small>Bienvenido, {usuario?.usuario || 'Cliente'}</small>
          </div>

          <div className="top-actions">
            <button className="btn" onClick={() => navigate('/cliente/carrito')}>
              🛒 Carrito
            </button>
            <button className="btn" onClick={() => navigate('/home')}>
              ← Volver al Inicio
            </button>
            <button className="btn btn-danger" onClick={cerrarSesion} style={{ marginLeft: '10px' }}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <h2 className="page-title">Productos Disponibles</h2>
        <p className="page-subtitle">Seleccione los productos que desea ordenar</p>

        {cargando ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando catálogo disponible...</p>
        ) : productos.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>Lo sentimos, no hay productos en stock en este momento.</p>
        ) : (
          <div className="product-grid">
            {productos.map((producto) => (
              <ProductoCard 
                key={producto.productID} 
                producto={producto} 
                onAgregarAlCarrito={agregarAlCarrito} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}