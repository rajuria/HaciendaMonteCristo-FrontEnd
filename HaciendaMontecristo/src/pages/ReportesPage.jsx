import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback, useMemo } from 'react'

export default function ReportesPage() {
  const navigate = useNavigate()
  
  // Recuperamos el nombre del admin para el header
  const usuarioAdmin = useMemo(() => {
    const u = localStorage.getItem('usuario');
    return u ? JSON.parse(u) : null;
  }, []);

  // --- ESTADOS ---
  const [pedidos, setPedidos] = useState([])
  const [metrics, setMetrics] = useState({
    ingresosTotales: "0.00",
    pedidosTotales: 0,
    completados: 0,
    cancelados: 0,
    pendientes: 0
  })
  const [cargando, setCargando] = useState(false)

  // Estados de fecha (Iniciamos con strings puros YYYY-MM-DD)
  const [fechaInicio, setFechaInicio] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().substring(0, 10);
  })
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().substring(0, 10))

  // --- OBTENCIÓN DE DATOS ---
  const fetchReportes = useCallback(async () => {
    setCargando(true)
    try {
      // Usamos substring(0,10) para asegurar que NUNCA viaje una coma o espacio
      const start = String(fechaInicio).substring(0, 10);
      const end = String(fechaFin).substring(0, 10);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/getStats/${start}/${end}`
      );
      const json = await response.json();

      if (response.ok) {
        setPedidos(json.data || []);
        setMetrics(json.stats);
      } else {
        console.error("Error en respuesta de stats:", json.error);
      }
    } catch (error) {
      console.error("Error de red:", error);
    } finally {
      setCargando(false)
    }
  }, [fechaInicio, fechaFin])

  useEffect(() => {
    fetchReportes()
  }, [fetchReportes])

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand purple">
            <h1>Hacienda Montecristo</h1>
            <small>Administrador: {usuarioAdmin?.usuario || 'Sesión Activa'}</small>
          </div>

          <div className="top-actions">
            <Link to="/admin-sistema/clientes"><button className="btn">Clientes</button></Link>
            <Link to="/admin-sistema/usuarios"><button className="btn">Usuarios</button></Link>
            <Link to="/admin-sistema/asignar-pedidos"><button className="btn">Ordenes</button></Link>
            <Link to="/admin-sistema/reportes"><button className="btn btn-purple">Reportes</button></Link>
            <button className="btn" onClick={() => navigate('/home')}>← Inicio</button>
          </div>
        </div>
      </header>

      <main className="container">
        <h2 className="page-title">Panel de Reportes</h2>
        <p className="page-subtitle">Visualización de ingresos y flujo de pedidos</p>

        {/* TARJETAS DE MÉTRICAS */}
        <div className="grid-3">
          <div className="stats-card">
            <h4>Ventas (Entregadas)</h4>
            <strong style={{ color: '#00853d' }}>L. {metrics.ingresosTotales}</strong>
            <p>{metrics.completados} órdenes cerradas</p>
          </div>

          <div className="stats-card">
            <h4>Pedidos Totales</h4>
            <strong>{metrics.pedidosTotales}</strong>
            <p>{metrics.pendientes} en proceso de entrega</p>
          </div>

          <div className="stats-card">
            <h4>Incidencias</h4>
            <strong style={{ color: '#ef4444' }}>{metrics.cancelados}</strong>
            <p>Órdenes canceladas</p>
          </div>
        </div>

        {/* FILTROS */}
        <div className="card filter-card" style={{ marginTop: 30 }}>
          <h3 className="section-title">📅 Filtrar Periodo</h3>
          <div className="form-grid-2" style={{ marginTop: 20 }}>
            <div className="field">
              <label>Fecha de Inicio</label>
              <input 
                type="date" 
                className="input" 
                value={fechaInicio} 
                onChange={(e) => setFechaInicio(e.target.value)} 
              />
            </div>
            <div className="field">
              <label>Fecha de Fin</label>
              <input 
                type="date" 
                className="input" 
                value={fechaFin} 
                onChange={(e) => setFechaFin(e.target.value)} 
              />
            </div>
          </div>
          <button 
            className="btn btn-purple" 
            style={{ marginTop: 20 }} 
            onClick={fetchReportes}
            disabled={cargando}
          >
            {cargando ? 'Cargando...' : '📊 Actualizar Reporte'}
          </button>
        </div>

        {/* TABLA DE DETALLES */}
        <div className="card" style={{ marginTop: 26 }}>
          <h3 className="section-title">Historial de Ventas Detallado</h3>
          <div className="summary-list" style={{ marginTop: 18 }}>
            {pedidos.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                No se encontraron transacciones en este rango de fechas.
              </p>
            ) : (
              pedidos.map((p) => (
                <div className="summary-item" key={p.orderID}>
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>Orden {p.orderID}</strong>
                    <div style={{ marginTop: 5, color: '#64748b', fontSize: '0.9rem' }}>
                      RTN: {p.RTN} | {new Date(p.fecha).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#00853d', fontWeight: 800, fontSize: '1.5rem' }}>
                      L. {Number(p.total).toFixed(2)}
                    </div>
                    <span className={`badge ${
                      p.status === 'Completado' ? 'badge-green' : 
                      p.status === 'Cancelada' ? 'badge-danger' : 'badge-gray'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}