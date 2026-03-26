import { useState } from 'react'

export default function GestionarUsuarioModal({ usuario, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    name: usuario.name || '',
    roleID: usuario.roleID || '',
    status: usuario.status || 'Activo',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGuardarCambios = async () => {
    setIsSubmitting(true)
    try {
      const payload = { ...formData }
      if (!payload.password) delete payload.password

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/update/${usuario.username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        alert("Usuario actualizado correctamente")
        onRefresh()
        onClose()
      } else {
        const err = await response.json()
        alert("Error: " + err.error)
      }
    } catch (error) {
      alert("Error de conexión al servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEliminarUsuario = async () => {
    const confirmar = window.confirm(`¿Está seguro de eliminar a ${usuario.username}? Esta acción no se puede deshacer.`)
    if (!confirmar) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/delete/${usuario.username}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert("Usuario eliminado con éxito")
        onRefresh()
        onClose()
      }
    } catch (error) {
      alert("Error al intentar eliminar el usuario")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 650 }}>
        <div className="modal-header">
          <div>
            <h3>Gestionar Usuario</h3>
            <p>ID de Acceso: <strong>{usuario.username}</strong></p>
          </div>
          <button className="btn btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', padding: '20px' }}>
          
          <section>
            <h4 style={{ marginBottom: '15px', color: '#6b21a8' }}>Datos de Perfil</h4>
            <div className="field">
              <label>Nombre Completo</label>
              <input className="input" name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="field" style={{ marginTop: '15px' }}>
              <label>Resetear Contraseña</label>
              <input 
                className="input" 
                type="password" 
                name="password" 
                placeholder="Dejar en blanco para no cambiar"
                value={formData.password} 
                onChange={handleChange} 
              />
              <small style={{ color: '#6b7280', fontSize: '0.75rem' }}>Solo llenar si el usuario olvido su clave.</small>
            </div>
          </section>

          <section style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '25px' }}>
            <h4 style={{ marginBottom: '15px', color: '#6b21a8' }}>Roles y Acceso</h4>
            
            <div className="field">
              <label>Rol Asignado</label>
              <select className="input" name="roleID" value={formData.roleID} onChange={handleChange}>
                <option value="Vendedor">Vendedor / Driver</option>
                <option value="Bodega">Auxiliar Bodega</option>
                <option value="Admin Bodega">Admin Bodega</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>

            <div className="field" style={{ marginTop: '15px' }}>
              <label>Estado de la Cuenta</label>
              <select className="input" name="status" value={formData.status} onChange={handleChange}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo / Suspendido</option>
              </select>
            </div>

            <div style={{ marginTop: '25px' }}>
              <button className="btn btn-danger btn-block" onClick={handleEliminarUsuario} disabled={isSubmitting}>
                🗑 Eliminar Acceso
              </button>
            </div>
          </section>
        </div>

        <div className="modal-actions" style={{ borderTop: '1px solid #e5e7eb', padding: '15px 20px' }}>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-purple" onClick={handleGuardarCambios} disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : '✔ Actualizar Usuario'}
          </button>
        </div>
      </div>
    </div>
  )
}