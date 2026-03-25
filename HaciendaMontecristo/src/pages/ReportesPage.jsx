import { Link, useNavigate } from 'react-router-dom'

const pedidos = [
  { id: '#p1', cliente: 'Sofía Hernández', fecha: '3/2/2026', total: 'L. 300.00', estado: 'pendiente' },
  { id: '#p2', cliente: 'Diego Ramírez', fecha: '2/2/2026', total: 'L. 240.00', estado: 'pendiente' },
]

export default function ReportesPage() {
  const navigate = useNavigate()

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand purple">
            <h1>Hacienda Montecristo</h1>
            <small>Administrador: Roberto Sánchez</small>
          </div>

          <div className="top-actions">
            <Link to="/admin-sistema/clientes">
              <button className="btn">Clientes</button>
            </Link>

            <Link to="/admin-sistema/usuarios">
              <button className="btn">Usuarios</button>
            </Link>

            <Link to="/admin-sistema/asignar-pedidos">
              <button className="btn">Asignar Pedidos</button>
            </Link>

            <Link to="/admin-sistema/reportes">
              <button className="btn btn-purple">Reportes</button>
            </Link>

            <Link to="/admin-sistema/mantenimiento">
              <button className="btn">Mantenimiento</button>
            </Link>

            <button className="btn" onClick={() => navigate('/home')}>
              ← Volver al Inicio
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <h2 className="page-title">Panel de Reportes</h2>
        <p className="page-subtitle">Visualice estadísticas y métricas del sistema</p>

        <div className="grid-3">
          <div className="stats-card">
            <h4>Ventas del Día</h4>
            <strong style={{ color: '#00853d' }}>L. 0.00</strong>
            <p>0 pedidos hoy</p>
          </div>

          <div className="stats-card">
            <h4>Pedidos Completados</h4>
            <strong>0</strong>
            <p>Total: L. 0.00</p>
          </div>

          <div className="stats-card">
            <h4>Pedidos Cancelados</h4>
            <strong>0</strong>
            <p>Total de cancelaciones</p>
          </div>
        </div>

        <div className="card filter-card">
          <h3 className="section-title">Filtros de Fecha</h3>

          <div className="form-grid-2" style={{ marginTop: 20 }}>
            <div className="field">
              <label>Fecha Inicio</label>
              <input className="input" placeholder="dd/mm/aaaa" />
            </div>

            <div className="field">
              <label>Fecha Fin</label>
              <input className="input" placeholder="dd/mm/aaaa" />
            </div>
          </div>

          <div className="top-actions">
            <button className="btn btn-purple">Aplicar Filtros</button>
            <button className="btn">⬇ Exportar a Excel</button>
          </div>
        </div>

        <div className="card" style={{ marginTop: 26 }}>
          <h3 className="section-title">Resumen de Pedidos</h3>

          <div className="summary-list" style={{ marginTop: 18 }}>
            {pedidos.map((pedido) => (
              <div className="summary-item" key={pedido.id}>
                <div>
                  <strong style={{ fontSize: '1.15rem' }}>Pedido {pedido.id}</strong>
                  <div style={{ marginTop: 8, color: '#64748b' }}>
                    {pedido.cliente} - {pedido.fecha}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#00853d', fontWeight: 900, fontSize: '1.6rem' }}>
                    {pedido.total}
                  </div>
                  <div style={{ color: '#64748b', marginTop: 6 }}>{pedido.estado}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}