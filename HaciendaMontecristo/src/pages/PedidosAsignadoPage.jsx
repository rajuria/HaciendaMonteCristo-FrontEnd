import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback, useMemo } from 'react'

export default function PedidosAsignadoPage() {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  // 1. Usamos useMemo para que el objeto 'usuario' sea estable y no cambie en cada render
  const usuarioLogueado = useMemo(() => {
    const u = localStorage.getItem('usuario');
    return u ? JSON.parse(u) : null;
  }, []);

  // 2. Extraemos el username para usarlo como dependencia simple (string)
  const username = usuarioLogueado?.usuario;

  const fetchPedidosAsignados = useCallback(async () => {
    if (!username) return;

    setCargando(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/getByVendor/${username}`);
      const json = await response.json();

      if (response.ok) {
        setPedidos(json.data || []);
      }
    } catch (error) {
      console.error("Error al cargar entregas:", error);
    } finally {
      setCargando(false)
    }
  }, [username]); // Ahora solo depende del string 'username', que es estable

  useEffect(() => {
    fetchPedidosAsignados()
  }, [fetchPedidosAsignados])

  const marcarComoCompletado = async (orderID) => {
    if (!window.confirm(`¿Confirmar entrega de orden ${orderID}?`)) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/modifyStatus/${orderID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completado' })
      });

      if (response.ok) {
        setPedidos(prev => prev.filter(p => p.orderID !== orderID));
      }
    } catch (error) {
      alert("Error de conexión.");
    }
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <h1>Hacienda Montecristo</h1>
            <small>Vendedor: {username || 'Usuario'}</small>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn" onClick={() => navigate('/home')}>← Inicio</button>
            <button className="btn btn-danger" onClick={() => { localStorage.removeItem('usuario'); navigate('/'); }}>
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <h2 className="page-title">📦 Mis Pedidos Asignados</h2>
        
        {cargando ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Cargando rutas...</p>
        ) : pedidos.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">✅</div>
            <h3>¡Todo al día!</h3>
            <p>No tienes pedidos pendientes de entrega.</p>
          </div>
        ) : (
          <div className="pedidos-grid" style={{ display: 'grid', gap: '20px' }}>
            {pedidos.map((p) => (
              <div key={p.orderID} className="card" style={{ borderLeft: '5px solid #22c55e', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>Orden: {p.orderID}</h4>
                    <p style={{ margin: '5px 0', color: '#4b5563' }}>RTN Cliente: {p.RTN}</p>
                  </div>
                  <button className="btn btn-green" onClick={() => marcarComoCompletado(p.orderID)}>
                    ✔ Entregado
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}