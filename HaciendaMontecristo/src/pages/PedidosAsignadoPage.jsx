import { useNavigate } from 'react-router-dom'

export default function PedidosAsignadoPage() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  const cerrarSesion = () => {
    localStorage.removeItem('usuario')
    navigate('/')
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <h1>Hacienda Montecristo</h1>
            <small>Vendedor: {usuario?.usuario || 'Usuario'}</small>
          </div>

          <button className="btn" onClick={() => navigate('/home')}>
            ← Volver al Inicio
          </button>
        </div>
      </header>

      <main className="container">
        <h2 className="page-title">Pedidos Asignados</h2>
        <p className="page-subtitle">Pedidos que debe entregar</p>

        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No hay pedidos asignados</h3>
          <p style={{ color: '#64748b' }}>No tiene pedidos pendientes de entrega</p>
        </div>
      </main>
    </div>
  )
}