import { useState } from 'react'

export default function GestionarClienteModal({ cliente, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    name: cliente.name || '',
    telephoneNumber: cliente.telephoneNumber || '',
    address: cliente.address || '',
    status: cliente.status || 'Activo'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGuardarCambios = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/update/${cliente.RTN}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert("Datos actualizados correctamente")
        onRefresh()
        onClose()
      } else {
        const err = await response.json()
        alert("Error: " + err.error)
      }
    } catch (error) {
      alert("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEliminarCliente = async () => {
    if (!window.confirm(`¿Seguro que deseas eliminar permanentemente a ${cliente.name}?`)) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/delete/${cliente.RTN}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert("Cliente eliminado del sistema")
        onRefresh()
        onClose()
      }
    } catch (error) {
      alert("Error al eliminar")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 700 }}>
        <div className="modal-header">
          <div>
            <h3>Gestionar Cliente</h3>
            <p>RTN: <strong>{cliente.RTN}</strong> | Email: {cliente.email}</p>
          </div>
          <button className="btn btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' }}>
          
          <section>
            <h4 style={{ marginBottom: '15px', color: '#4b5563' }}>Información Personal</h4>
            <div className="field">
              <label>Nombre Completo</label>
              <input className="input" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Teléfono</label>
              <input className="input" name="telephoneNumber" value={formData.telephoneNumber} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Dirección Física</label>
              <textarea className="textarea" name="address" value={formData.address} onChange={handleChange} style={{ height: '80px' }} />
            </div>
          </section>

          <section style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '20px' }}>
            <h4 style={{ marginBottom: '15px', color: '#4b5563' }}>Estado y Control</h4>
            
            <div className="field">
              <label>Estado del Cliente</label>
              <select className="input" name="status" value={formData.status} onChange={handleChange}>
                <option value="Activo">Activo (Aprobado)</option>
                <option value="Pendiente">Pendiente de Revisión</option>
                <option value="Desactivado">Desactivado / Bloqueado</option>
              </select>
            </div>

            <div style={{ marginTop: '30px' }}>
              <button className="btn btn-danger btn-block" onClick={handleEliminarCliente} disabled={isSubmitting}>
                🗑 Eliminar Cliente
              </button>
            </div>
          </section>
        </div>

        <div className="modal-actions" style={{ borderTop: '1px solid #e5e7eb', padding: '15px 20px' }}>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-green" onClick={handleGuardarCambios} disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : '✔ Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}