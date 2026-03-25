import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function ConfirmarPedidoPage() {
  const [carrito, setCarrito] = useState([])
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const navigate = useNavigate()

  const [entrega, setEntrega] = useState({
    nombre: 'Sofía Hernández',
    correo: 'sofia@email.com',
    telefono: '9999-9999',
    direccion: 'Tegucigalpa, Col. Palmira',
  })

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || []
    setCarrito(carritoGuardado)
  }, [])

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  const handleChangeEntrega = (e) => {
    const { name, value } = e.target
    setEntrega((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const confirmarPedidoFinal = () => {
    if (
      !entrega.nombre.trim() ||
      !entrega.correo.trim() ||
      !entrega.telefono.trim() ||
      !entrega.direccion.trim()
    ) {
      alert('Complete toda la información de entrega.')
      return
    }

    alert('Pedido confirmado con éxito')
    localStorage.removeItem('carrito')
    navigate('/cliente/productos')
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div style={{ fontWeight: 700 }}>
            <Link to="/cliente/carrito">← Volver al Carrito</Link>
          </div>
        </div>
      </header>

      <main className="container confirmar-container">
        <h2 className="page-title">Confirmar Pedido</h2>

        <div className="confirmar-card">
          <h3>Resumen del Pedido</h3>

          {carrito.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No hay productos en el carrito.</p>
          ) : (
            <>
              {carrito.map((item) => (
                <div className="confirmar-row" key={item.id}>
                  <span>
                    {item.nombre} x {item.cantidad}
                  </span>
                  <strong>L. {(item.precio * item.cantidad).toFixed(2)}</strong>
                </div>
              ))}

              <div className="confirmar-total">
                <span>Total:</span>
                <strong>L. {total.toFixed(2)}</strong>
              </div>
            </>
          )}
        </div>

        <div className="confirmar-card">
          <h3>Forma de Pago</h3>

          <label className="metodo-pago">
            <input
              type="radio"
              name="metodoPago"
              value="efectivo"
              checked={metodoPago === 'efectivo'}
              onChange={(e) => setMetodoPago(e.target.value)}
            />
            <div>
              <strong>Efectivo</strong>
              <p>Pago contra entrega</p>
            </div>
          </label>

          <label className="metodo-pago">
            <input
              type="radio"
              name="metodoPago"
              value="transferencia"
              checked={metodoPago === 'transferencia'}
              onChange={(e) => setMetodoPago(e.target.value)}
            />
            <div>
              <strong>Transferencia Bancaria</strong>
              <p>Debe cargar comprobante</p>
            </div>
          </label>
        </div>

        <div className="confirmar-card">
          <h3>Información de Entrega</h3>

          <div className="field">
            <label>Cliente</label>
            <input
              type="text"
              name="nombre"
              value={entrega.nombre}
              onChange={handleChangeEntrega}
              className="input"
            />
          </div>

          <div className="field">
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              value={entrega.correo}
              onChange={handleChangeEntrega}
              className="input"
            />
          </div>

          <div className="field">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={entrega.telefono}
              onChange={handleChangeEntrega}
              className="input"
            />
          </div>

          <div className="field">
            <label>Dirección de Entrega</label>
            <textarea
              name="direccion"
              value={entrega.direccion}
              onChange={handleChangeEntrega}
              className="textarea"
            />
          </div>

          <div className="confirmar-actions">
            <button className="btn" onClick={() => navigate('/cliente/carrito')}>
              Cancelar
            </button>

            <button
              className="btn btn-green"
              onClick={confirmarPedidoFinal}
              disabled={carrito.length === 0}
            >
              Confirmar Pedido
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}