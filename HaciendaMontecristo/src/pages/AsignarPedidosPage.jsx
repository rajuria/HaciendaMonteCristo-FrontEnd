import { Link } from 'react-router-dom'

export default function AsignarPedidosPage() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div style={{ fontWeight: 700 }}>
            <Link to="/admin-sistema/clientes">← Volver a Clientes</Link>
          </div>
        </div>
      </header>

      <main className="container">
        <h2 className="page-title">Asignar Pedidos a Vendedores</h2>
        <p className="page-subtitle">Asigne pedidos pendientes a vendedores disponibles</p>

        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No hay pedidos pendientes</h3>
          <p style={{ color: '#64748b' }}>Todos los pedidos han sido asignados</p>
        </div>
      </main>
    </div>
  )
}