import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import NuevoProductoModal from '../components/NuevoProductoModal'
import EditarProductoModal from '../components/EditarProductoModal'

export default function AdminBodegaPage() {
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false)
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  const [productos, setProductos] = useState([
    { id: 1, codigo: 'P001', nombre: 'Café Orgánico Premium', precio: 150.0, stock: 200, activo: true },
    { id: 2, codigo: 'P002', nombre: 'Frijoles Negros', precio: 80.0, stock: 150, activo: true },
    { id: 3, codigo: 'P003', nombre: 'Arroz Integral', precio: 95.0, stock: 300, activo: true },
    { id: 4, codigo: 'P004', nombre: 'Miel de Abeja Natural', precio: 120.0, stock: 75, activo: true },
    { id: 5, codigo: 'P005', nombre: 'Azúcar Morena', precio: 60.0, stock: 250, activo: true },
    { id: 6, codigo: 'P006', nombre: 'Aceite de Coco', precio: 180.0, stock: 100, activo: true },
    { id: 7, codigo: 'P007', nombre: 'Quinoa Orgánica', precio: 200.0, stock: 80, activo: true },
    { id: 8, codigo: 'P008', nombre: 'Harina de Trigo Integral', precio: 70.0, stock: 180, activo: true },
  ])

  const cerrarSesion = () => {
    localStorage.removeItem('usuario')
    navigate('/')
  }

  const agregarProducto = (nuevoProducto) => {
    setProductos((prev) => [...prev, { ...nuevoProducto, activo: true }])
    alert('Producto agregado con éxito.')
  }

  const abrirEditarProducto = (producto) => {
    setProductoSeleccionado(producto)
    setMostrarModalEditar(true)
  }

  const guardarEdicionProducto = (productoActualizado) => {
    const productosActualizados = productos.map((producto) =>
      producto.id === productoActualizado.id
        ? { ...productoActualizado, activo: producto.activo }
        : producto
    )

    setProductos(productosActualizados)
    alert('Producto actualizado con éxito.')
  }

  const eliminarProducto = (id) => {
    const confirmar = window.confirm('¿Está seguro de eliminar este producto?')
    if (!confirmar) return

    const nuevosProductos = productos.filter((producto) => producto.id !== id)
    setProductos(nuevosProductos)
    alert('Producto eliminado.')
  }

  const toggleBloquearProducto = (id) => {
    const producto = productos.find((p) => p.id === id)
    if (!producto) return

    const accion = producto.activo ? 'bloquear' : 'activar'
    const confirmar = window.confirm(`¿Está seguro de ${accion} este producto?`)
    if (!confirmar) return

    const nuevosProductos = productos.map((p) =>
      p.id === id ? { ...p, activo: !p.activo } : p
    )

    setProductos(nuevosProductos)
    alert(`Producto ${accion === 'bloquear' ? 'bloqueado' : 'activado'} con éxito.`)
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand green">
            <h1>Hacienda Montecristo</h1>
            <small>Admin Bodega: {usuario?.usuario || 'Usuario'}</small>
          </div>

          <div className="top-actions">
            <Link to="/admin-bodega/cancelaciones">
              <button className="btn">Revisar Cancelaciones</button>
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
            <h2 className="page-title">Gestión de Productos</h2>
            <p className="page-subtitle">Administre el catálogo de productos</p>
          </div>

          <button
            className="btn btn-green"
            onClick={() => setMostrarModalNuevo(true)}
          >
            ＋ Nuevo Producto
          </button>
        </div>

        <div className="card">
          <h3 className="section-title">📦 Lista de Productos</h3>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Precio (L.)</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productos.map((producto) => (
                  <tr
                    key={producto.id}
                    style={{ opacity: producto.activo ? 1 : 0.5 }}
                  >
                    <td>{producto.codigo}</td>

                    <td>
                      {producto.nombre}
                      {!producto.activo && (
                        <span className="estado-bloqueado-texto"> (Bloqueado)</span>
                      )}
                    </td>

                    <td>{producto.precio.toFixed(2)}</td>
                    <td>{producto.stock}</td>

                    <td>
                      <span className={producto.activo ? 'badge badge-green' : 'badge badge-gray'}>
                        {producto.activo ? 'Activo' : 'Bloqueado'}
                      </span>
                    </td>

                    <td>
                      <div className="acciones-botones">
                        <button
                          className="btn btn-sm"
                          onClick={() => abrirEditarProducto(producto)}
                        >
                          ✏ Editar
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => eliminarProducto(producto.id)}
                        >
                          🗑 Borrar
                        </button>

                        <button
                          className={`btn btn-sm ${producto.activo ? 'btn-warning' : 'btn-green'}`}
                          onClick={() => toggleBloquearProducto(producto.id)}
                        >
                          {producto.activo ? '🚫 Bloquear' : '✔ Activar'}
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
        <NuevoProductoModal
          onClose={() => setMostrarModalNuevo(false)}
          onSave={agregarProducto}
        />
      )}

      {mostrarModalEditar && (
        <EditarProductoModal
          producto={productoSeleccionado}
          onClose={() => {
            setMostrarModalEditar(false)
            setProductoSeleccionado(null)
          }}
          onSave={guardarEdicionProducto}
        />
      )}
    </div>
  )
}