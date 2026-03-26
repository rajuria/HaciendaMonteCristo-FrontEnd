import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import NuevoProductoModal from '../components/NuevoProductoModal';
import EditarProductoModal from '../components/EditarProductoModal';
import AddImageModal from '../components/AddImageModal'; // Asegúrate que el nombre coincida

export default function AdminBodegaPage() {
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productoParaImagen, setProductoParaImagen] = useState(null);
  
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // 1. Cargar productos (GET) - Envuelto en useCallback para poder reutilizarlo
  const fetchProductos = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/get`);
      const json = await response.json();
      
      if (response.ok) {
        setProductos(json.data);
      } else {
        console.error('Error al cargar:', json.error);
      }
    } catch (error) {
      console.error('Error de red:', error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  // 2. Agregar producto (POST)
  const agregarProducto = async (nuevoProducto) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto) 
      });
      const json = await response.json();

      if (response.ok) {
        setProductos((prev) => [...prev, json.data]);
        alert('Producto agregado con éxito.');
        setMostrarModalNuevo(false);
      } else {
        alert(`Error: ${json.error}`);
      }
    } catch (error) {
      alert('Error de conexión al agregar el producto.');
    }
  };

  const abrirEditarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarModalEditar(true);
  };

  // 3. Editar producto (PUT)
  const guardarEdicionProducto = async (productoActualizado) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/update/${productoActualizado.productID}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoActualizado)
      });
      const json = await response.json();

      if (response.ok) {
        setProductos(prev => prev.map(p => p.productID === json.data.productID ? json.data : p));
        alert('Producto actualizado con éxito.');
        setMostrarModalEditar(false);
      } else {
        alert(`Error: ${json.error}`);
      }
    } catch (error) {
      alert('Error de conexión al actualizar el producto.');
    }
  };

  // 4. Bloquear / Activar (PUT)
  const toggleBloquearProducto = async (producto) => {
    const esActivo = producto.status !== 'Deshabilitado';
    const accion = esActivo ? 'bloquear' : 'activar';
    
    if (!window.confirm(`¿Está seguro de ${accion} este producto?`)) return;

    try {
      let response;
      if (esActivo) {
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/delete/${producto.productID}`, { method: 'PUT' });
      } else {
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/update/${producto.productID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Activo' }) 
        });
      }

      if (response.ok) {
        setProductos(prev => prev.map(p => 
          p.productID === producto.productID 
            ? { ...p, status: esActivo ? 'Deshabilitado' : 'Activo' } 
            : p
        ));
        alert(`Producto ${esActivo ? 'bloqueado' : 'activado'} con éxito.`);
      } else {
        const json = await response.json();
        alert(`Error: ${json.error}`);
      }
    } catch (error) {
      alert(`Error de conexión.`);
    }
  };

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
            <button className="btn" onClick={() => navigate('/home')}>← Inicio</button>
            <button className="btn btn-danger" onClick={cerrarSesion} style={{marginLeft: '10px'}}>Salir</button>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="section-title-row">
          <div>
            <h2 className="page-title">Gestión de Productos</h2>
            <p className="page-subtitle">Administre el catálogo de productos y multimedia</p>
          </div>
          <button className="btn btn-green" onClick={() => setMostrarModalNuevo(true)}>＋ Nuevo Producto</button>
        </div>

        <div className="card">
          <h3 className="section-title">📦 Lista de Productos</h3>
          {cargando ? (
            <p style={{ padding: '20px', textAlign: 'center' }}>Conectando con la base de datos...</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => {
                    const esActivo = producto.status !== 'Deshabilitado';
                    return (
                      <tr key={producto.productID} style={{ opacity: esActivo ? 1 : 0.6 }}>
                        <td>{producto.productID}</td>
                        <td style={{ fontWeight: 600 }}>{producto.name}</td>
                        <td>L. {Number(producto.currentPrice).toFixed(2)}</td>
                        <td>{producto.currentStock}</td>
                        <td>
                          <span className={esActivo ? 'badge badge-green' : 'badge badge-gray'}>
                            {esActivo ? 'Activo' : 'Bloqueado'}
                          </span>
                        </td>
                        <td>
                          <div className="acciones-botones">
                            <button className="btn btn-sm" onClick={() => abrirEditarProducto(producto)} disabled={!esActivo} title="Editar">✏</button>
                            <button className="btn btn-sm" onClick={() => setProductoParaImagen(producto)} disabled={!esActivo} title="Gestionar Imagen">🖼️</button>
                            <button className={`btn btn-sm ${esActivo ? 'btn-warning' : 'btn-green'}`} onClick={() => toggleBloquearProducto(producto)} title={esActivo ? "Bloquear" : "Activar"}>
                              {esActivo ? '🚫' : '✔'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modales */}
      {mostrarModalNuevo && <NuevoProductoModal onClose={() => setMostrarModalNuevo(false)} onSave={agregarProducto} />}
      
      {mostrarModalEditar && (
        <EditarProductoModal 
          producto={productoSeleccionado} 
          onClose={() => { setMostrarModalEditar(false); setProductoSeleccionado(null); }} 
          onSave={guardarEdicionProducto} 
        />
      )}

      {productoParaImagen && (
        <AddImageModal 
          product={productoParaImagen} 
          onClose={() => setProductoParaImagen(null)} 
          onRefresh={fetchProductos} 
        />
      )}
    </div>
  );
}