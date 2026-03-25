import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function CarritoPage() {
  const [carrito, setCarrito] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || []
    setCarrito(carritoGuardado)
  }, [])

  const guardarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito)
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito))
  }

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (!nuevaCantidad || nuevaCantidad < 1) return

    const nuevoCarrito = carrito.map((item) => {
      if (item.id === id) {
        const cantidadFinal = nuevaCantidad > item.stock ? item.stock : nuevaCantidad
        return { ...item, cantidad: cantidadFinal }
      }
      return item
    })

    guardarCarrito(nuevoCarrito)
  }

  const aumentarCantidad = (id) => {
    const nuevoCarrito = carrito.map((item) => {
      if (item.id === id) {
        const nuevaCantidad = item.cantidad + 1
        return {
          ...item,
          cantidad: nuevaCantidad > item.stock ? item.stock : nuevaCantidad,
        }
      }
      return item
    })

    guardarCarrito(nuevoCarrito)
  }

  const disminuirCantidad = (id) => {
    const nuevoCarrito = carrito.map((item) => {
      if (item.id === id) {
        const nuevaCantidad = item.cantidad - 1
        return {
          ...item,
          cantidad: nuevaCantidad < 1 ? 1 : nuevaCantidad,
        }
      }
      return item
    })

    guardarCarrito(nuevoCarrito)
  }

  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id)
    guardarCarrito(nuevoCarrito)
  }

  const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0)

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div style={{ fontWeight: 700 }}>
            <Link to="/cliente/productos">← Volver a Productos</Link>
          </div>

          <div className="brand green" style={{ textAlign: 'right' }}>
            <h1>Hacienda Montecristo</h1>
            <small>Sofía Hernández</small>
          </div>
        </div>
      </header>

      <main className="container" style={{ maxWidth: 1100 }}>
        <h2 className="page-title">Carrito de Compras</h2>

        <div className="cart-layout">
          <div>
            {carrito.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p style={{ color: '#64748b' }}>Agrega productos para continuar</p>
              </div>
            ) : (
              carrito.map((item) => (
                <div className="cart-item" key={item.id} style={{ marginBottom: 16 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{item.nombre}</h3>
                    <p style={{ margin: '10px 0 0', color: '#4b5563' }}>
                      L. {item.precio.toFixed(2)} c/u
                    </p>
                  </div>

                  <div className="quantity-control">
                    <button
                      className="qty-btn"
                      onClick={() => disminuirCantidad(item.id)}
                    >
                      -
                    </button>

                    <input
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.cantidad}
                      onChange={(e) => actualizarCantidad(item.id, Number(e.target.value))}
                      className="qty-input"
                    />

                    <button
                      className="qty-btn"
                      onClick={() => aumentarCantidad(item.id)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => eliminarProducto(item.id)}
                    className="delete-btn"
                    title="Eliminar producto"
                  >
                    🗑
                  </button>

                  <div className="total-box">
                    L. {(item.precio * item.cantidad).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>

          <aside className="resume-card">
            <h3 style={{ marginTop: 0 }}>Resumen del Pedido</h3>

            <div className="resume-row">
              <span>Subtotal:</span>
              <strong>L. {subtotal.toFixed(2)}</strong>
            </div>

            <div className="resume-row">
              <span>Productos:</span>
              <strong>{totalProductos}</strong>
            </div>

            <div className="resume-total">
              <span>Total:</span>
              <span>L. {subtotal.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-green btn-block"
              disabled={carrito.length === 0}
              onClick={() => navigate('/cliente/confirmar-pedido')}
            >
              Confirmar Pedido
            </button>
          </aside>
        </div>
      </main>
    </div>
  )
}