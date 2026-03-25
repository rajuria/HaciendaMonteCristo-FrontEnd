import { useState } from 'react'
import '../styles/pages.css'

export default function NuevoProductoModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    precio: '',
    stock: '',
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
      !formData.codigo.trim() ||
      !formData.nombre.trim() ||
      formData.precio === '' ||
      formData.stock === ''
    ) {
      alert('Complete todos los campos.')
      return
    }

    const nuevoProducto = {
      id: Date.now(),
      codigo: formData.codigo.trim(),
      nombre: formData.nombre.trim(),
      precio: Number(formData.precio),
      stock: Number(formData.stock),
    }

    onSave(nuevoProducto)

    setFormData({
      codigo: '',
      nombre: '',
      precio: '',
      stock: '',
    })

    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 560 }}>
        <div className="modal-header">
          <div>
            <h3>Nuevo Producto</h3>
            <p>Ingrese los detalles del nuevo producto</p>
          </div>

          <button className="btn btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Código</label>
            <input
              className="input"
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Nombre del Producto</label>
            <input
              className="input"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Precio (L.)</label>
            <input
              className="input"
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>

          <div className="field">
            <label>Stock Disponible</label>
            <input
              className="input"
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancelar
            </button>

            <button type="submit" className="btn btn-light-green">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}