import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import NuevoRangoFacturaModal from '../pages/NuevoRangoFacturaModal'
import EditarRangoFacturaModal from '../pages/EditarRangoFacturaModal'

export default function MantenimientoPage() {
  const navigate = useNavigate()
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false)
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false)
  const [rangoSeleccionado, setRangoSeleccionado] = useState(null)

  const [rangos, setRangos] = useState([
    {
      id: 1,
      nombre: 'Rango 2026-001',
      rtn: '0801-1990-12345',
      cai: 'A1B2C3-D4E5F6-G7H8I9-J0K1L2-M3N4O5-P6',
      rango: '00000001 - 00001000',
      actual: '00000001',
      disponibles: 1000,
      totalDisponibles: 1000,
      fechaLimite: '31/12/2026',
      estado: 'Activo',
    },
    {
      id: 2,
      nombre: 'Rango 2025-004',
      rtn: '0801-1990-12345',
      cai: 'Z9Y8X7-W6V5U4-T3S2R1-Q0P9O8-N7M6L5-K4',
      rango: '00003001 - 00004000',
      actual: '00003856',
      disponibles: 145,
      totalDisponibles: 1000,
      fechaLimite: '31/12/2025',
      estado: 'Inactivo',
    },
  ])

  const agregarRango = (nuevoRango) => {
    setRangos((prev) => [nuevoRango, ...prev])
    alert('Rango creado con éxito.')
  }

  const abrirEditarRango = (rango) => {
    setRangoSeleccionado(rango)
    setMostrarModalEditar(true)
  }

  const guardarEdicionRango = (rangoActualizado) => {
    const nuevos = rangos.map((rango) =>
      rango.id === rangoActualizado.id ? rangoActualizado : rango
    )
    setRangos(nuevos)
    alert('Rango actualizado con éxito.')
  }

  const toggleEstado = (id) => {
    const nuevos = rangos.map((rango) =>
      rango.id === id
        ? { ...rango, estado: rango.estado === 'Activo' ? 'Inactivo' : 'Activo' }
        : rango
    )
    setRangos(nuevos)
  }

  const eliminarRango = (id) => {
    const confirmar = window.confirm('¿Desea eliminar este rango de factura?')
    if (!confirmar) return

    setRangos((prev) => prev.filter((rango) => rango.id !== id))
    alert('Rango eliminado.')
  }

  const verRango = (rango) => {
    alert(
      `Nombre: ${rango.nombre}\nRTN: ${rango.rtn}\nCAI: ${rango.cai}\nRango: ${rango.rango}\nActual: ${rango.actual}`
    )
  }

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
              <button className="btn">Reportes</button>
            </Link>

            <Link to="/admin-sistema/mantenimiento">
              <button className="btn btn-purple">Mantenimiento</button>
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
            <h2 className="page-title">Mantenimiento del Sistema</h2>
            <p className="page-subtitle">Gestión de rangos de facturación</p>
          </div>

          <button
            className="btn btn-green"
            onClick={() => setMostrarModalNuevo(true)}
          >
            ＋ Nuevo Rango
          </button>
        </div>

        <div className="card">
          <h3 className="section-title">📄 Rangos de Factura</h3>
          <p className="page-subtitle" style={{ marginTop: '8px' }}>
            Administre los rangos de facturación autorizados por la DEI
          </p>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>RTN</th>
                  <th>CAI</th>
                  <th>Rango</th>
                  <th>Actual</th>
                  <th>Disponibles</th>
                  <th>Fecha Límite</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {rangos.map((rango) => (
                  <tr key={rango.id}>
                    <td>{rango.nombre}</td>
                    <td>{rango.rtn}</td>
                    <td>{rango.cai}</td>
                    <td>{rango.rango}</td>
                    <td>{rango.actual}</td>
                    <td>
                      <span className={rango.disponibles <= 200 ? 'texto-alerta' : ''}>
                        {rango.disponibles}
                      </span>{' '}
                      <span className="texto-suave">de {rango.totalDisponibles}</span>
                    </td>
                    <td>{rango.fechaLimite}</td>
                    <td>
                      <span className={rango.estado === 'Activo' ? 'badge badge-dark' : 'badge badge-gray'}>
                        {rango.estado}
                      </span>
                    </td>
                    <td>
                      <div className="acciones-iconos">
                        <button className="icon-btn" onClick={() => verRango(rango)} title="Ver">
                          👁
                        </button>

                        <button
                          className="icon-btn"
                          title="Editar"
                          onClick={() => abrirEditarRango(rango)}
                        >
                          ✏
                        </button>

                        {rango.estado === 'Activo' ? (
                          <button
                            className="icon-btn icon-danger"
                            title="Desactivar"
                            onClick={() => toggleEstado(rango.id)}
                          >
                            ⛔
                          </button>
                        ) : (
                          <button
                            className="icon-btn icon-success"
                            title="Activar"
                            onClick={() => toggleEstado(rango.id)}
                          >
                            ✔
                          </button>
                        )}

                        <button
                          className="icon-btn icon-danger"
                          title="Eliminar"
                          onClick={() => eliminarRango(rango.id)}
                        >
                          ✖
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {mostrarModalNuevo && (
        <NuevoRangoFacturaModal
          onClose={() => setMostrarModalNuevo(false)}
          onSave={agregarRango}
        />
      )}

      {mostrarModalEditar && (
        <EditarRangoFacturaModal
          rango={rangoSeleccionado}
          onClose={() => {
            setMostrarModalEditar(false)
            setRangoSeleccionado(null)
          }}
          onSave={guardarEdicionRango}
        />
      )}
    </div>
  )
}