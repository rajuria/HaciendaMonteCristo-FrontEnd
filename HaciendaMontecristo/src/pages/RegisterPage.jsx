import { Link } from 'react-router-dom'

export default function RegisterPage() {
  return (
    <div className="center-page">
      <div className="auth-card">
        <div className="auth-icon">🍃</div>
        <h1 className="auth-title" style={{ fontSize: '2rem' }}>Crear Cuenta</h1>
        <p className="auth-subtitle">Complete los datos del cliente</p>

        <div className="field">
          <label>Nombre Completo</label>
          <input className="input" />
        </div>

        <div className="field">
          <label>Correo Electrónico</label>
          <input className="input" />
        </div>

        <div className="field">
          <label>Teléfono</label>
          <input className="input" placeholder="9999-9999" />
        </div>

        <div className="field">
          <label>Dirección</label>
          <textarea className="textarea" />
        </div>

        <button className="btn btn-green btn-block">Registrarse</button>

        <Link to="/login">
          <button className="btn btn-block" style={{ marginTop: 12 }}>Ya tengo cuenta</button>
        </Link>

        <div style={{ textAlign: 'center', marginTop: 18, fontWeight: 700 }}>
          <Link to="/">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  )
}