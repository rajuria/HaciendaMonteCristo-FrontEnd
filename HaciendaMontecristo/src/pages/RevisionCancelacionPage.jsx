import { Link, useNavigate } from 'react-router-dom'

export default function RevisionCancelacionPage() {
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
          <div style={{ fontWeight: 700 }}>
            <Link to="/admin-bodega">← Volver a Productos</Link>
          </div>

          <div className="brand green" style={{ textAlign: 'right' }}>
            <h1>Hacienda Montecristo</h1>
            <small>Admin Bodega: {usuario?.usuario || 'Usuario'}</small>
          </div>

          <button className="btn" onClick={cerrarSesion}>
            ↪ Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="container">
        <h2 className="page-title">Revisión de Cancelaciones</h2>
        <p className="page-subtitle">Solicitudes de cancelación de pedidos</p>

        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No hay solicitudes pendientes</h3>
          <p style={{ color: '#64748b' }}>No hay solicitudes de cancelación para revisar</p>
        </div>
      </main>
    </div>
  )
}