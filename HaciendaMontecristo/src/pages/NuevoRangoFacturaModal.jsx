import { useState } from 'react'
import '../styles/pages.css'

export default function NuevoRangoFacturaModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: '',
    rtn: '0801-1990-12345',
    cai: '',
    numeroInicial: '1',
    numeroFinal: '1000',
    fechaLimite: '',
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
      !formData.rtn.trim() ||
      !formData.cai.trim() ||
      !formData.numeroInicial.trim() ||
      !formData.numeroFinal.trim() ||
      !formData.fechaLimite.trim()
    ) {
      alert('Complete todos los campos.')
      return
    }

    const inicial = Number(formData.numeroInicial)
    const final = Number(formData.numeroFinal)

    if (final < inicial) {
      alert('El número final no puede ser menor que el número inicial.')
      return
    }

    const nuevoRango = {
      id: Date.now(),
      nombre: formData.nombre.trim(),
      rtn: formData.rtn.trim(),
      cai: formData.cai.trim(),
      rango: `${String(inicial).padStart(8, '0')} - ${String(final).padStart(8, '0')}`,
      actual: String(inicial).padStart(8, '0'),
      disponibles: final - inicial + 1,
      totalDisponibles: final - inicial + 1,
      fechaLimite: formData.fechaLimite,
      estado: 'Activo',
    }

    onSave(nuevoRango)
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal mantenimiento-modal">
        <div className="modal-header">
          <div>
            <h3>Crear Nuevo Rango de Factura</h3>
            <p>Ingrese los datos del rango autorizado por la DEI</p>
          </div>

          <button className="btn btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="field">
              <label>Nombre del Rango *</label>
              <input
                className="input"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Rango 2026-001"
              />
            </div>

            <div className="field">
              <label>RTN *</label>
              <input
                className="input"
                type="text"
                name="rtn"
                value={formData.rtn}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <label>CAI (Código de Autorización de Impresión) *</label>
            <input
              className="input"
              type="text"
              name="cai"
              value={formData.cai}
              onChange={handleChange}
              placeholder="Ingrese el CAI autorizado"
            />
          </div>

          <div className="form-grid-2">
            <div className="field">
              <label>Número Inicial *</label>
              <input
                className="input"
                type="number"
                name="numeroInicial"
                value={formData.numeroInicial}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="field">
              <label>Número Final *</label>
              <input
                className="input"
                type="number"
                name="numeroFinal"
                value={formData.numeroFinal}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>

          <div className="field">
            <label>Fecha Límite de Emisión *</label>
            <input
              className="input"
              type="date"
              name="fechaLimite"
              value={formData.fechaLimite}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancelar
            </button>

            <button type="submit" className="btn btn-green">
              ＋ Crear Rango
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}