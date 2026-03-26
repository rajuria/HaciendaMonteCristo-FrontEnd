import { useEffect, useState } from 'react'
import '../styles/pages.css'

export default function EditarProductoModal({ producto, onClose, onSave }) {
  // 1. Alineamos el estado con las columnas de tu base de datos
  const [formData, setFormData] = useState({
    productID: '',
    name: '',
    currentPrice: '',
    currentStock: '',
  })

  // 2. Cargamos los datos exactos del producto cuando se abre el modal
  useEffect(() => {
    if (producto) {
      setFormData({
        productID: producto.productID || '',
        name: producto.name || '',
        currentPrice: producto.currentPrice !== undefined ? producto.currentPrice : '',
        currentStock: producto.currentStock !== undefined ? producto.currentStock : '',
      })
    }
  }, [producto])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // 3. Validar usando las llaves nuevas
    if (
      !formData.name?.toString().trim() ||
      formData.currentPrice === '' ||
      formData.currentStock === ''
    ) {
      alert('Complete todos los campos editables.')
      return
    }

    // 4. Formatear el objeto para enviarlo de vuelta a AdminBodegaPage
    const productoActualizado = {
      productID: formData.productID, // Necesitamos esto para la URL del PUT
      name: formData.name.trim(),
      currentPrice: Number(formData.currentPrice),
      currentStock: Number(formData.currentStock),
    }

    onSave(productoActualizado)
    // Se elimina el onClose() para que AdminBodegaPage lo maneje solo si el API responde 200 OK
  }

  if (!producto) return null

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 560 }}>
        <div className="modal-header">
          <div>
            <h3>Editar Producto</h3>
            <p>Actualice la información del producto</p>
          </div>

          <button className="btn btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Código (ID del Producto)</label>
            <input
              className="input input-disabled"
              type="number"
              name="productID"
              value={formData.productID}
              disabled // El ID no se debe cambiar según tu controlador de backend
            />
          </div>

          <div className="field">
            <label>Nombre del Producto</label>
            <input
              className="input"
              type="text"
              name="name" // Actualizado
              value={formData.name} // Actualizado
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Precio (L.)</label>
            <input
              className="input"
              type="number"
              name="currentPrice" // Actualizado
              value={formData.currentPrice} // Actualizado
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
              name="currentStock" // Actualizado
              value={formData.currentStock} // Actualizado
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancelar
            </button>

            <button type="submit" className="btn btn-green">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}