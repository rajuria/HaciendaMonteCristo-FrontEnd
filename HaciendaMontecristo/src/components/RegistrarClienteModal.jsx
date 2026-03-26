import { useState } from 'react'

export default function RegistrarClienteModal({ onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    RTN: '', 
    name: '',
    email: '',
    telephoneNumber: '',
    address: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.RTN || !formData.name || !formData.email || !formData.telephoneNumber) {
      alert('RTN, Nombre, Email y Teléfono son obligatorios.')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            RTN: formData.RTN,
            name: formData.name,
            email: formData.email,
            telephoneNumber: formData.telephoneNumber,
            address: formData.address,
            status: 'Activo'
        })
      })

      if (response.ok) {
        alert('Cliente registrado con éxito.')
        onRefresh()
        onClose()
      } else {
        const error = await response.json()
        alert('Error: ' + error.error)
      }
    } catch (err) {
      alert('Error de conexión con el servidor.')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <h3>Nuevo Registro de Cliente</h3>
          <button className="btn btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '0 20px 20px 20px' }}>
          <div className="field">
            <label>RTN / Identidad</label>
            <input className="input" type="text" name="RTN" value={formData.RTN} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Nombre Completo</label>
            <input className="input" type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Correo Electrónico</label>
            <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Teléfono</label>
            <input className="input" type="text" name="telephoneNumber" value={formData.telephoneNumber} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Dirección</label>
            <textarea className="textarea" name="address" value={formData.address} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-green btn-block" style={{ marginTop: 20 }}>
            ✔ Registrar en Sistema
          </button>
        </form>
      </div>
    </div>
  )
}