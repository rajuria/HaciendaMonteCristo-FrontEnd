import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import NuevoUsuarioModal from '../components/NuevoUsuarioModal'
import GestionarUsuarioModal from '../components/GestionarUsuarioModal'


export default function GestionUsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)

  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)

  const navigate = useNavigate()
  const adminActual = JSON.parse(localStorage.getItem('usuario'))

  const fetchUsuarios = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/get`)
      const json = await response.json()
      if (response.ok) {
        setUsuarios(json.data)
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    fetchUsuarios()
  }, [fetchUsuarios])

  const usuariosFiltrados = usuarios.filter(u => 
    u.name?.toLowerCase().includes(busqueda.toLowerCase()) || 
    u.username?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand purple">
            <h1>Hacienda Montecristo</h1>
            <small>Administrador: {adminActual?.usuario || 'Admin'}</small>
          </div>

          <div className="top-actions">
            <Link to="/admin-sistema/clientes"><button className="btn">Clientes</button></Link>
            <Link to="/admin-sistema/usuarios"><button className="btn btn-purple">Usuarios</button></Link>
            <Link to="/admin-sistema/asignar-pedidos"><button className="btn">Ordenes</button></Link>
            <Link to="/admin-sistema/reportes"><button className="btn">Reportes</button></Link>
            <Link to="/admin-sistema/mantenimiento"><button className="btn">Mantenimiento</button></Link>
            <button className="btn" onClick={() => navigate('/home')}>← Inicio</button>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="section-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <div>
            <h2 className="page-title">Gestión de Usuarios</h2>
            <p className="page-subtitle">Administre accesos y roles del personal</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="🔍 Buscar por nombre o usuario..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ width: 280 }}
            />
            <button className="btn btn-purple" onClick={() => setMostrarModalNuevo(true)}>
              + Nuevo Usuario
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">👥 Usuarios del Sistema</h3>

          <div className="table-wrap">
            {cargando ? (
              <p style={{textAlign: 'center', padding: '40px'}}>Cargando usuarios...</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((u) => (
                    <tr key={u.username}>
                      <td><strong>{u.username}</strong></td>
                      <td>{u.name}</td>
                      <td>
                        <span className="badge badge-blue">{u.roleID}</span>
                      </td>
                      <td>
                        <span className={`badge ${u.status === 'activo' ? 'badge-green' : 'badge-gray'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm"
                          onClick={() => setUsuarioSeleccionado(u)}
                        >
                          Gestionar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {mostrarModalNuevo && (
        <NuevoUsuarioModal 
          onClose={() => setMostrarModalNuevo(false)} 
          onRefresh={fetchUsuarios} 
        />
      )}

      {usuarioSeleccionado && (
        <GestionarUsuarioModal 
          usuario={usuarioSeleccionado} 
          onClose={() => setUsuarioSeleccionado(null)} 
          onRefresh={fetchUsuarios} 
        />
      )}
    </div>
  )
}