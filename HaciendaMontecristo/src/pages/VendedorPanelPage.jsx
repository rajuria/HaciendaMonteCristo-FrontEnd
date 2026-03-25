import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import RegistrarClienteModal from '../components/RegistrarClienteModal'

export default function VendedorPanelPage() {
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false)
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <h1>Hacienda Montecristo</h1>
            <small>Vendedor: {usuario?.usuario || 'Usuario'}</small>
          </div>

          <button className="btn" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </div>
      </header>

      <main className="container" style={{ maxWidth: 900, textAlign: 'center' }}>
        <h2 className="page-title">Panel de Vendedor</h2>
        <p className="page-subtitle">Seleccione una opción para continuar</p>

        <div className="option-grid-2">
          <div className="option-card">
            <div
              className="circle-icon circle-blue"
              style={{ margin: '0 auto 12px' }}
            >
              📦
            </div>
            <h3>Mis Pedidos</h3>
            <p>Ver y gestionar pedidos asignados</p>

            <Link to="/vendedor/pedidos">
              <button className="btn btn-blue btn-block">Acceder</button>
            </Link>
          </div>

          <div className="option-card">
            <div
              className="circle-icon circle-green"
              style={{ margin: '0 auto 12px' }}
            >
              👤
            </div>
            <h3>Crear Nuevo Cliente</h3>
            <p>Registrar un cliente nuevo</p>

            <button
              className="btn btn-green btn-block"
              onClick={() => setMostrarModalCliente(true)}
            >
              Acceder
            </button>
          </div>
        </div>
      </main>

      {mostrarModalCliente && (
        <RegistrarClienteModal onClose={() => setMostrarModalCliente(false)} />
      )}
    </div>
  )
}