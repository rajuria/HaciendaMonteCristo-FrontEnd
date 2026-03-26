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

  const actualizarCantidad = (productID, nuevaCantidad) => {
    if (!nuevaCantidad || nuevaCantidad < 1) return

    const nuevoCarrito = carrito.map((item) => {
      if (item.productID === productID) {
        // Asegurarse de no exceder el currentStock
        const cantidadFinal = nuevaCantidad > item.currentStock ? item.currentStock : nuevaCantidad
        return { ...item, cantidad: cantidadFinal }
      }
      return item
    })

    guardarCarrito(nuevoCarrito)
  }

  const aumentarCantidad = (productID) => {
    const nuevoCarrito = carrito.map((item) => {
      if (item.productID === productID) {
        const nuevaCantidad = item.cantidad + 1
        return {
          ...item,
          cantidad: nuevaCantidad > item.currentStock ? item.currentStock : nuevaCantidad,
        }
      }
      return item
    })

    guardarCarrito(nuevoCarrito)
  }

  const disminuirCantidad = (productID) => {
    const nuevoCarrito = carrito.map((item) => {
      if (item.productID === productID) {
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

  const eliminarProducto = (productID) => {
    const nuevoCarrito = carrito.filter((item) => item.productID !== productID)
    guardarCarrito(nuevoCarrito)
  }

  // Actualizados para usar currentPrice
  const subtotal = carrito.reduce((acc, item) => acc + (Number(item.currentPrice) * item.cantidad), 0)
  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0)

  // Obtener el usuario activo para el header
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div style={{ fontWeight: 700 }}>
            <Link to="/cliente/productos">← Volver a Productos</Link>
          </div>

          <div className="brand green" style={{ textAlign: 'right' }}>
            <h1>Hacienda Montecristo</h1>
            <small>{usuario?.usuario || 'Cliente'}</small>
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
                <div className="cart-item" key={item.productID} style={{ marginBottom: 16 }}>
                  <div>
                    {/* Usando item.name y item.currentPrice */}
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{item.name}</h3>
                    <p style={{ margin: '10px 0 0', color: '#4b5563' }}>
                      L. {Number(item.currentPrice).toFixed(2)} c/u
                    </p>
                  </div>

                  <div className="quantity-control">
                    <button
                      className="qty-btn"
                      onClick={() => disminuirCantidad(item.productID)}
                    >
                      -
                    </button>

                    <input
                      type="number"
                      min="1"
                      max={item.currentStock}
                      value={item.cantidad}
                      onChange={(e) => actualizarCantidad(item.productID, Number(e.target.value))}
                      className="qty-input"
                    />

                    <button
                      className="qty-btn"
                      onClick={() => aumentarCantidad(item.productID)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => eliminarProducto(item.productID)}
                    className="delete-btn"
                    title="Eliminar producto"
                  >
                    🗑
                  </button>

                  <div className="total-box">
                    L. {(Number(item.currentPrice) * item.cantidad).toFixed(2)}
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