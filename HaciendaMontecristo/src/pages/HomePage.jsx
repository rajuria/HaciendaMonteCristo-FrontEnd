import { Link, useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  const cerrarSesion = () => {
    localStorage.removeItem('usuario')
    navigate('/')
  }

  return (
    <div className="home-page">
      <div className="home-wrap">
        <div className="logo-round">🍃</div>

        <h1 className="home-title">Hacienda Montecristo</h1>
        <p className="home-subtitle">Sistema de Gestión Agro-Industrial</p>
        <p className="home-text">
          Bienvenido, {usuario?.usuario || 'Usuario'}.
          Productos orgánicos de la más alta calidad, directo del campo a su hogar
        </p>

        <div className="feature-strip">
          <div className="feature-mini">
            <div className="icon">🌱</div>
            <h4>100% Orgánico</h4>
            <p>Productos cultivados naturalmente</p>
          </div>

          <div className="feature-mini">
            <div className="icon">🚚</div>
            <h4>Entrega Rápida</h4>
            <p>Directamente a su puerta</p>
          </div>

          <div className="feature-mini">
            <div className="icon">💳</div>
            <h4>Pago Flexible</h4>
            <p>Efectivo, transferencia o crédito</p>
          </div>
        </div>

        <h2 className="module-title">Explorar el Sistema</h2>
        <p className="module-subtitle">
          Accede directamente a cada módulo del sistema
        </p>

        <div className="module-grid">
          <div className="module-card">
            <div className="circle-icon circle-green">🛒</div>
            <h3>Cliente</h3>
            <p>Ver productos, carrito y realizar pedidos</p>
            <Link to="/cliente/productos">
              <button className="btn btn-green btn-block">Ver Demo</button>
            </Link>
          </div>

          <div className="module-card">
            <div className="circle-icon circle-blue">👥</div>
            <h3>Vendedor</h3>
            <p>Gestionar pedidos y crear clientes</p>
            <Link to="/vendedor">
              <button className="btn btn-blue btn-block">Ver Demo</button>
            </Link>
          </div>

          <div className="module-card">
            <div className="circle-icon circle-orange">📦</div>
            <h3>Admin Bodega</h3>
            <p>Productos y cancelaciones</p>
            <Link to="/admin-bodega">
              <button className="btn btn-orange btn-block">Ver Demo</button>
            </Link>
          </div>

          <div className="module-card">
            <div className="circle-icon circle-purple">🛡️</div>
            <h3>Admin Sistema</h3>
            <p>Aprobar clientes y gestionar crédito</p>
            <Link to="/admin-sistema/clientes">
              <button className="btn btn-purple btn-block">Ver Demo</button>
            </Link>
          </div>
        </div>

        <p className="footer-note">
          © 2026 Hacienda Montecristo - Todos los derechos reservados
        </p>

        <div style={{ marginTop: '30px' }}>
          <button className="btn" onClick={cerrarSesion}>
            ↪ Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}