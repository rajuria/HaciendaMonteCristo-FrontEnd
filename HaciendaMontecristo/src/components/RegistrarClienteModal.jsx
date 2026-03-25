import { useState } from 'react'
import '../styles/pages.css'

export default function RegistrarClienteModal({ onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (
      !formData.nombre.trim() ||
      !formData.correo.trim() ||
      !formData.telefono.trim() ||
      !formData.direccion.trim()
    ) {
      alert('Complete todos los campos.')
      return
    }

    alert('Cliente creado con éxito.')

    setFormData({
      nombre: '',
      correo: '',
      telefono: '',
      direccion: '',
    })

    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 620 }}>
        <div className="modal-header">
          <div>
            <h3>Registrar Nuevo Cliente</h3>
            <p>Complete los detalles del cliente para registrarlo.</p>
          </div>

          <button className="btn btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="card" style={{ padding: 26 }}>
          <h2 style={{ textAlign: 'center', marginTop: 0 }}>Crear Nuevo Cliente</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 24 }}>
            Complete los datos del cliente
          </p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Nombre Completo</label>
              <input
                className="input"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Correo Electrónico</label>
              <input
                className="input"
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Teléfono</label>
              <input
                className="input"
                type="text"
                name="telefono"
                placeholder="9999-9999"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Dirección</label>
              <textarea
                className="textarea"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-green btn-block">
              Registrar Cliente
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}