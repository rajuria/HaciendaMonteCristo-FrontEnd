import { useState } from 'react'

export default function NuevoUsuarioModal({ onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    roleID: 'vendedor'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert("Usuario creado exitosamente")
        onRefresh()
        onClose()
      } else {
        const error = await response.json()
        alert("Error: " + error.error)
      }
    } catch (err) {
      alert("Error de conexión")
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <h3>Registrar Nuevo Usuario</h3>
          <button className="btn btn-sm" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 20 }}>
          <div className="field">
            <label>Nombre de Usuario (Username)</label>
            <input className="input" type="text" value={formData.username} 
              onChange={(e) => setFormData({...formData, username: e.target.value})} required />
          </div>
          <div className="field">
            <label>Nombre Completo</label>
            <input className="input" type="text" value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input className="input" type="password" value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          </div>
          <div className="field">
            <label>Rol del Sistema</label>
            <select className="input" value={formData.roleID} 
              onChange={(e) => setFormData({...formData, roleID: e.target.value})}>
              <option value="vendedor">Vendedor / Driver</option>
              <option value="bodega">Bodega</option>
              <option value="admin-bodega">Admin Bodega</option>
              <option value="admin">Administrador Sistema</option>
            </select>
          </div>
          <button type="submit" className="btn btn-purple btn-block" style={{ marginTop: 20 }}>
            Crear Usuario
          </button>
        </form>
      </div>
    </div>
  )
}