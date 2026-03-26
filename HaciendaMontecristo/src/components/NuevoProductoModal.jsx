import { useState } from 'react'
import '../styles/pages.css'

export default function NuevoProductoModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    productID: '',
    name: '',
    currentPrice: '',
    currentStock: '',
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
      !String(formData.productID).trim() ||
      !formData.name.trim() ||
      formData.currentPrice === '' ||
      formData.currentStock === ''
    ) {
      alert('Complete todos los campos.')
      return
    }

    const nuevoProducto = {
      productID: Number(formData.productID), 
      name: formData.name.trim(),
      currentPrice: Number(formData.currentPrice),
      currentStock: Number(formData.currentStock),
    }

    // Enviamos el objeto a AdminBodegaPage para que haga el POST
    onSave(nuevoProducto)

    // Solo reiniciamos el formulario aquí. AdminBodegaPage se encarga de cerrar el modal.
    setFormData({
      productID: '',
      name: '',
      currentPrice: '',
      currentStock: '',
    })
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
            <label>Código (ID del Producto)</label>
            <input
              className="input"
              type="number" // Cambiado a number para coincidir con la DB
              name="productID"
              value={formData.productID}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Nombre del Producto</label>
            <input
              className="input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Precio (L.)</label>
            <input
              className="input"
              type="number"
              name="currentPrice"
              value={formData.currentPrice}
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
              name="currentStock"
              value={formData.currentStock}
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