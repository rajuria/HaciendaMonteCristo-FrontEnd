import { Link, useNavigate } from 'react-router-dom'

const clientes = [
  ['Laura Flores', 'laura@email.com', '7777-7777', 'La Ceiba, Centro', 'Pendiente'],
  ['Pedro Castillo', 'pedro@email.com', '6666-6666', 'Choluteca, Barrio El Centro', 'Pendiente'],
]

export default function AdminSistemaClientesPage() {
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
              <button className="btn btn-purple">Clientes</button>
            </Link>

            <Link to="/admin-sistema/usuarios">
              <button className="btn">Usuarios</button>
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
        <h2 className="page-title">Gestión de Clientes</h2>
        <p className="page-subtitle">Administre las cuentas de clientes</p>

        <div className="card">
          <h3 className="section-title">👥 Clientes</h3>

          <div className="tabs">
            <button className="tab active">Activos</button>
            <button className="tab">Pendientes</button>
            <button className="tab">Desactivados</button>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {clientes.map(([nombre, email, telefono, direccion, estado]) => (
                  <tr key={email}>
                    <td>{nombre}</td>
                    <td>{email}</td>
                    <td>{telefono}</td>
                    <td>{direccion}</td>
                    <td>
                      <span className="badge badge-gray">{estado}</span>
                    </td>
                    <td>
                      <button className="btn btn-green btn-sm">✔ Aprobar</button>
                    </td>
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