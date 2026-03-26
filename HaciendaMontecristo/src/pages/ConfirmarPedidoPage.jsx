import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function ConfirmarPedidoPage() {
  const [carrito, setCarrito] = useState([])
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [selectedRTN, setSelectedRTN] = useState('')

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || []
    if (carritoGuardado.length === 0) {
      navigate('/cliente/productos')
    }
    setCarrito(carritoGuardado)

    const fetchClientes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/get`);
        const json = await response.json();
        
        if (response.ok && json.data) {
          setClientes(json.data);
        }
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };

    fetchClientes();
  }, [navigate])

  const total = carrito.reduce((acc, item) => acc + Number(item.currentPrice) * item.cantidad, 0)

  const clienteSeleccionado = clientes.find(c => c.RTN === selectedRTN)

  const confirmarPedidoFinal = async () => {
    if (!selectedRTN) {
      alert('Por favor, seleccione un cliente para la facturación y entrega.')
      return
    }

    setIsSubmitting(true)

    try {
      const orderPayload = {
        RTN: selectedRTN,
        metodoPago: metodoPago,
        total: total,
        status: 'Pendiente',
        
        orderDetails: carrito.map(item => ({
          productID: item.productID,
          quantity: item.cantidad,
          price: Number(item.currentPrice)
        }))
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`¡Pedido confirmado con éxito! \nSu número de orden es: ${data.orderID}`);
        
        localStorage.removeItem('carrito');
        navigate('/cliente/productos');
      } else {
        alert(`Hubo un problema: ${data.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error de red al crear orden:', error)
      alert('Error de conexión al servidor.')
    } finally {
      setIsSubmitting(false)
    }
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
                <div className="confirmar-row" key={item.productID}>
                  <span>{item.name} x {item.cantidad}</span>
                  <strong>L. {(Number(item.currentPrice) * item.cantidad).toFixed(2)}</strong>
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
          <h3>Información de Facturación y Entrega</h3>

          <div className="field">
            <label>Seleccione un Cliente</label>
            <select 
              className="input" 
              value={selectedRTN} 
              onChange={(e) => setSelectedRTN(e.target.value)}
              style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">-- Elija un cliente registrado --</option>
              {clientes.map(cliente => (
                <option key={cliente.RTN} value={cliente.RTN}>
                  {cliente.name} (RTN: {cliente.RTN})
                </option>
              ))}
            </select>
          </div>

          {clienteSeleccionado && (
            <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <p style={{ margin: '0 0 8px 0' }}><strong>Email:</strong> {clienteSeleccionado.email}</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>Teléfono:</strong> {clienteSeleccionado.telephoneNumber}</p>
              <p style={{ margin: '0' }}><strong>Dirección:</strong> {clienteSeleccionado.address}</p>
            </div>
          )}

          <div className="confirmar-actions" style={{ marginTop: '20px' }}>
            <button className="btn" onClick={() => navigate('/cliente/carrito')} disabled={isSubmitting}>
              Cancelar
            </button>

            <button
              className="btn btn-green"
              onClick={confirmarPedidoFinal}
              disabled={carrito.length === 0 || !selectedRTN || isSubmitting}
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}