import { Link, useNavigate } from 'react-router-dom'

const usuarios = [
  ['Juan Pérez', 'vendedor@hacienda.com', 'Vendedor', 'Inactivo'],
  ['María García', 'vendedor2@hacienda.com', 'Vendedor', 'Inactivo'],
  ['Carlos López', 'bodega@hacienda.com', 'Bodega', 'Inactivo'],
  ['Ana Martínez', 'admin-bodega@hacienda.com', 'Admin Bodega', 'Inactivo'],
  ['Roberto Sánchez', 'admin@hacienda.com', 'Admin', 'Inactivo'],
]

export default function GestionUsuariosPage() {
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
              <button className="btn btn-purple">Usuarios</button>
            </Link>

            <Link to="/admin-sistema/asignar-pedidos">
              <button className="btn">Asignar Pedidos</button>
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
        <div className="section-title-row">
          <div>
            <h2 className="page-title">Gestión de Usuarios</h2>
            <p className="page-subtitle">Administre usuarios del sistema</p>
          </div>

          <button className="btn btn-purple">＋ Nuevo Usuario</button>
        </div>

        <div className="card">
          <h3 className="section-title">👥 Usuarios del Sistema</h3>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map(([nombre, email, rol, estado]) => (
                  <tr key={email}>
                    <td>{nombre}</td>
                    <td>{email}</td>
                    <td>{rol}</td>
                    <td><span className="badge badge-gray">{estado}</span></td>
                    <td><button className="btn btn-sm">Editar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}