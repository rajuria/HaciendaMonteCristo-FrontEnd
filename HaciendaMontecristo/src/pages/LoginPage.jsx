import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    usuario: '',
    password: '',
    tipo: 'cliente',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogin = (e) => {
    e.preventDefault()

    if (!form.usuario.trim() || !form.password.trim()) {
      alert('Ingrese usuario y contraseña.')
      return
    }

    localStorage.setItem('usuario', JSON.stringify(form))
    navigate('/home')
  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <div className="auth-logo">🍃</div>
        <h2>Hacienda Montecristo</h2>
        <p>Ingrese sus credenciales para continuar</p>

        <div className="field">
          <label>Usuario</label>
          <input
            className="input"
            type="text"
            name="usuario"
            value={form.usuario}
            onChange={handleChange}
            placeholder="Ingrese su usuario"
          />
        </div>

        <div className="field">
          <label>Contraseña</label>
          <input
            className="input"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Ingrese su contraseña"
          />
        </div>

        <div className="field">
          <label>Tipo de Usuario</label>
          <select
            className="input"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
          >
            <option value="cliente">Cliente</option>
            <option value="vendedor">Vendedor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button type="submit" className="btn btn-green btn-block">
          Ingresar
        </button>
      </form>
    </div>
  )
}