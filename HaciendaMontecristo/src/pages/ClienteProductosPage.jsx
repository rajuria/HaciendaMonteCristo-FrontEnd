import { useNavigate } from 'react-router-dom'

const productos = [
  { id: 1, nombre: 'Café Orgánico Premium', precio: 150, stock: 200 },
  { id: 2, nombre: 'Frijoles Negros', precio: 80, stock: 150 },
  { id: 3, nombre: 'Arroz Integral', precio: 95, stock: 300 },
  { id: 4, nombre: 'Miel de Abeja Natural', precio: 120, stock: 75 },
  { id: 5, nombre: 'Azúcar Morena', precio: 60, stock: 250 },
  { id: 6, nombre: 'Aceite de Coco', precio: 180, stock: 100 },
]

export default function ClienteProductosPage() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  const cerrarSesion = () => {
    localStorage.removeItem('usuario')
    navigate('/')
  }

  const agregarAlCarrito = (producto) => {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || []

    const productoExistente = carritoActual.find((item) => item.id === producto.id)

    let nuevoCarrito

    if (productoExistente) {
      nuevoCarrito = carritoActual.map((item) =>
        item.id === producto.id
          ? {
              ...item,
              cantidad: item.cantidad + 1 <= item.stock ? item.cantidad + 1 : item.cantidad,
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
          </div>
        </div>
      </header>

      <main className="container">
        <h2 className="page-title">Productos Disponibles</h2>
        <p className="page-subtitle">Seleccione los productos que desea ordenar</p>

        <div className="product-grid">
          {productos.map((producto) => (
            <div className="product-card" key={producto.id}>
              <div className="product-image">📦</div>
              <h3 className="product-title">{producto.nombre}</h3>

              <div className="product-row">
                <div className="product-price">L. {producto.precio.toFixed(2)}</div>
                <span className="badge badge-stock">Stock: {producto.stock}</span>
              </div>

              <button
                className="btn btn-green btn-block"
                onClick={() => agregarAlCarrito(producto)}
              >
                🛒 Agregar al Carrito
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}