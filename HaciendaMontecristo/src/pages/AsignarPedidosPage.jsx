import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'

export default function AsignarPedidosPage() {
  const [pedidos, setPedidos] = useState([])
  const [vendedores, setVendedores] = useState([])
  const [filtroTab, setFiltroTab] = useState('Pendiente') 
  const [asignaciones, setAsignaciones] = useState({}) 
  const [cargando, setCargando] = useState(true)
  
  const navigate = useNavigate()
  const usuarioAdmin = JSON.parse(localStorage.getItem('usuario'))

  const formatearFechaLimpia = (fechaObj) => {
    const year = fechaObj.getFullYear();
    const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const day = String(fechaObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; 
  };

  const fetchData = useCallback(async () => {
    setCargando(true)
    try {
      const hoy = formatearFechaLimpia(new Date());
      
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - 90); 
      const inicio = formatearFechaLimpia(fechaInicio);

      console.log(`Consultando órdenes: ${inicio} al ${hoy}`);

      const resPedidos = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/getByDate/${inicio}/${hoy}`);
      const dataPedidos = await resPedidos.json();

      const resUsers = await fetch(`${import.meta.env.VITE_API_URL}/api/users/get`);
      const dataUsers = await resUsers.json();

      if (resPedidos.ok && resUsers.ok) {
        setPedidos(dataPedidos.data || []);
        
        const soloVendedores = (dataUsers.data || []).filter(u => 
          u.roleID?.toLowerCase() === 'vendedor'
        );
        setVendedores(soloVendedores);
      }
    } catch (error) {
      console.error("Error en la sincronización logística:", error);
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const ejecutarAsignacion = async (orderID) => {
    const vendedorID = asignaciones[orderID];
    
    if (!vendedorID) {
      alert("Por favor, seleccione un vendedor de la lista.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/asignarOrden/${orderID}/${vendedorID}`, {
        method: 'PUT'
      });

      if (response.ok) {
        alert(`¡Orden ${orderID} asignada con éxito!`);
        fetchData();
      } else {
        const err = await response.json();
        alert("Error al asignar: " + err.error);
      }
    } catch (error) {
      alert("Error de conexión al servidor.");
    }
  }

  const pedidosFiltrados = pedidos.filter(p => {
    if (filtroTab === 'Asignada') return p.status === 'Asignada';
    if (filtroTab === 'Completado') return p.status === 'Completado';
    if (filtroTab === 'Cancelada') return p.status === 'Cancelada' || p.status === 'Cancelacion Pendiente';
    return p.status === 'Pendiente';
  });

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand purple">
            <h1>Hacienda Montecristo</h1>
            <small>Logística: {usuarioAdmin?.usuario || 'Admin'}</small>
          </div>

          <div className="top-actions">
            <Link to="/admin-sistema/clientes"><button className="btn">Clientes</button></Link>
            <Link to="/admin-sistema/usuarios"><button className="btn">Usuarios</button></Link>
            <Link to="/admin-sistema/asignar-pedidos">
              <button className="btn btn-purple">Ordenes</button>
            </Link>
            <Link to="/admin-sistema/reportes"><button className="btn">Reportes</button></Link>
            <button className="btn" onClick={() => navigate('/home')}>← Inicio</button>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="section-title-row">
          <div>
            <h2 className="page-title">Monitor de Logística</h2>
            <p className="page-subtitle">Asigne y supervise el flujo de pedidos en tiempo real</p>
          </div>
          <button className="btn btn-sm" onClick={fetchData}>🔄 Sincronizar</button>
        </div>

        <div className="card">
          <div className="tabs">
            <button 
              className={`tab ${filtroTab === 'Pendiente' ? 'active' : ''}`} 
              onClick={() => setFiltroTab('Pendiente')}
            >
              Pendientes ({pedidos.filter(p => p.status === 'Pendiente').length})
            </button>
            <button 
              className={`tab ${filtroTab === 'Asignada' ? 'active' : ''}`} 
              onClick={() => setFiltroTab('Asignada')}
            >
              En Ruta ({pedidos.filter(p => p.status === 'Asignada').length})
            </button>
            <button 
              className={`tab ${filtroTab === 'Completado' ? 'active' : ''}`} 
              onClick={() => setFiltroTab('Completado')}
            >
              Entregados
            </button>
          </div>

          <div className="table-wrap">
            {cargando ? (
              <p style={{ textAlign: 'center', padding: '40px' }}>Consultando base de datos...</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Orden ID</th>
                    <th>Cliente</th>
                    <th>{filtroTab === 'Pendiente' ? 'Asignar Vendedor' : 'Responsable'}</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                        No hay pedidos en esta categoría.
                      </td>
                    </tr>
                  ) : (
                    pedidosFiltrados.map((p) => (
                      <tr key={p.orderID}>
                        <td><strong>{p.orderID}</strong></td>
                        <td>{p.RTN}</td>
                        <td>
                          {filtroTab === 'Pendiente' ? (
                            <select 
                              className="input"
                              style={{ padding: '4px', fontSize: '0.85rem' }}
                              onChange={(e) => setAsignaciones({ ...asignaciones, [p.orderID]: e.target.value })}
                            >
                              <option value="">-- Seleccionar --</option>
                              {vendedores.map(v => (
                                <option key={v.username} value={v.username}>{v.name}</option>
                              ))}
                            </select>
                          ) : (
                            <span>{p.vendedor || 'N/A'}</span>
                          )}
                        </td>
                        <td>
                          {filtroTab === 'Pendiente' ? (
                            <button 
                              className="btn btn-green btn-sm"
                              onClick={() => ejecutarAsignacion(p.orderID)}
                            >
                              ✔ Asignar
                            </button>
                          ) : filtroTab === 'Asignada' ? (
                            <span className="badge badge-blue">🚚 En camino</span>
                          ) : (
                            <span className="badge badge-green">✔ Entregado</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}