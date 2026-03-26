import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import RegistrarClienteModal from '../components/RegistrarClienteModal'
import GestionarClienteModal from '../components/GestionarClienteModal'

export default function AdminSistemaClientesPage() {
  
  const [clientes, setClientes] = useState([])
  const [filtroTab, setFiltroTab] = useState('activo') 
  const [busqueda, setBusqueda] = useState('') 
  const [cargando, setCargando] = useState(true)

  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false)
  const [clienteAEditar, setClienteAEditar] = useState(null) 
  
  const navigate = useNavigate()
  const usuarioAdmin = JSON.parse(localStorage.getItem('usuario'))

  const fetchClientes = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/get`)
      const json = await response.json()
      if (response.ok) {
        setClientes(json.data)
      }
    } catch (error) {
      console.error("Error al cargar clientes:", error)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    fetchClientes()
  }, [fetchClientes])

  const clientesFiltrados = clientes.filter(c => {
    
    const cumpleTab = filtroTab === 'Pendiente' ? c.status === 'Pendiente' :
                     filtroTab === 'Desactivado' ? (c.status === 'Desactivado' || c.status === 'Bloqueado') :
                     (c.status === 'Activo' || !c.status);
    
    const valorBusqueda = busqueda.toLowerCase()
    const cumpleBusqueda = (
      c.name?.toLowerCase().includes(valorBusqueda) || 
      c.RTN?.includes(busqueda)
    );

    return cumpleTab && cumpleBusqueda;
  })

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand purple">
            <h1>Hacienda Montecristo</h1>
            <small>Administrador: {usuarioAdmin?.usuario || 'Admin'}</small>
          </div>

          <div className="top-actions">
            <Link to="/admin-sistema/clientes">
              <button className="btn btn-purple">Clientes</button>
            </Link>

            <Link to="/admin-sistema/usuarios">
              <button className="btn">Usuarios</button>
            </Link>

            <Link to="/admin-sistema/asignar-pedidos">
              <button className="btn">Ordenes</button>
            </Link>

            <Link to="/admin-sistema/reportes">
              <button className="btn">Reportes</button>
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
        <div className="section-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <div>
            <h2 className="page-title">Gestión de Clientes</h2>
            <p className="page-subtitle">Administre las cuentas y estados de los clientes registrados</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="🔍 Buscar por nombre o RTN..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ width: 280 }}
            />
            <button
              className="btn btn-green"
              onClick={() => setMostrarModalNuevo(true)}
            >
              + Nuevo Cliente
            </button>
          </div>
        </div>

        <div className="card">
          <div className="tabs">
            <button 
              className={`tab ${filtroTab === 'Activo' ? 'active' : ''}`} 
              onClick={() => setFiltroTab('Activo')}
            >
              Activos
            </button>
            <button 
              className={`tab ${filtroTab === 'Pendiente' ? 'active' : ''}`} 
              onClick={() => setFiltroTab('Pendiente')}
            >
              Pendientes
            </button>
            <button 
              className={`tab ${filtroTab === 'Desactivado' ? 'active' : ''}`} 
              onClick={() => setFiltroTab('Desactivado')}
            >
              Desactivados
            </button>
          </div>

          <div className="table-wrap">
            {cargando ? (
              <p style={{ textAlign: 'center', padding: '40px' }}>Cargando datos...</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>RTN</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                        No se encontraron resultados.
                      </td>
                    </tr>
                  ) : (
                    clientesFiltrados.map((cliente) => (
                      <tr key={cliente.RTN}>
                        <td><strong>{cliente.RTN}</strong></td>
                        <td>{cliente.name}</td>
                        <td>{cliente.email}</td>
                        <td>{cliente.telephoneNumber}</td>
                        <td>
                          <span className={`badge ${cliente.status === 'Activo' ? 'badge-green' : 'badge-gray'}`}>
                            {cliente.status || 'Activo'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm" 
                            onClick={() => setClienteAEditar(cliente)}
                          >
                            Gestionar
                          </button>
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

      {mostrarModalNuevo && (
        <RegistrarClienteModal 
          onClose={() => setMostrarModalNuevo(false)} 
          onRefresh={fetchClientes} 
        />
      )}

      {clienteAEditar && (
        <GestionarClienteModal 
          cliente={clienteAEditar} 
          onClose={() => setClienteAEditar(null)} 
          onRefresh={fetchClientes} 
        />
      )}
    </div>
  )
}