import { useEffect, useState } from 'react'
import '../styles/pages.css'

export default function EditarRangoFacturaModal({ rango, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    rtn: '',
    cai: '',
    numeroInicial: '',
    numeroFinal: '',
    actual: '',
    fechaLimite: '',
    estado: 'Activo',
  })

  useEffect(() => {
    if (rango) {
      const partes = rango.rango.split(' - ')
      const inicial = partes[0] || ''
      const final = partes[1] || ''

      let fechaFormateada = rango.fechaLimite
      if (rango.fechaLimite.includes('/')) {
        const [dd, mm, yyyy] = rango.fechaLimite.split('/')
        fechaFormateada = `${yyyy}-${mm}-${dd}`
      }

      setFormData({
        id: rango.id,
        nombre: rango.nombre,
        rtn: rango.rtn,
        cai: rango.cai,
        numeroInicial: String(Number(inicial)),
        numeroFinal: String(Number(final)),
        actual: rango.actual,
        fechaLimite: fechaFormateada,
        estado: rango.estado,
      })
    }
  }, [rango])

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
    const actual = Number(formData.actual)

    if (final < inicial) {
      alert('El número final no puede ser menor que el número inicial.')
      return
    }

    if (actual < inicial || actual > final) {
      alert('El número actual debe estar dentro del rango.')
      return
    }

    const disponibles = final - actual + 1

    const [yyyy, mm, dd] = formData.fechaLimite.split('-')
    const fechaMostrar = `${dd}/${mm}/${yyyy}`

    const rangoActualizado = {
      id: formData.id,
      nombre: formData.nombre.trim(),
      rtn: formData.rtn.trim(),
      cai: formData.cai.trim(),
      rango: `${String(inicial).padStart(8, '0')} - ${String(final).padStart(8, '0')}`,
      actual: String(actual).padStart(8, '0'),
      disponibles,
      totalDisponibles: final - inicial + 1,
      fechaLimite: fechaMostrar,
      estado: formData.estado,
    }

    onSave(rangoActualizado)
    onClose()
  }

  if (!rango) return null

  return (
    <div className="modal-overlay">
      <div className="modal mantenimiento-modal">
        <div className="modal-header">
          <div>
            <h3>Editar Rango de Factura</h3>
            <p>Actualice los datos del rango autorizado por la DEI</p>
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

          <div className="form-grid-2">
            <div className="field">
              <label>Número Actual *</label>
              <input
                className="input"
                type="number"
                name="actual"
                value={Number(formData.actual)}
                onChange={handleChange}
                min="1"
              />
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
          </div>

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancelar
            </button>

            <button type="submit" className="btn btn-green">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}