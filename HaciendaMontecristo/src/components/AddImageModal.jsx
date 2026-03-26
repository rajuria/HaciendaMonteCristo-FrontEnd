import { useState } from 'react'

export default function AddImageModal({ product, onClose, onRefresh }) {
  const [imageUrl, setImageUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddImage = async () => {
    if (!imageUrl.trim()) return alert("Por favor ingrese una URL válida.")

    setIsSubmitting(true)
    try {
      const payload = {
        imageID: "IMG-" + Date.now(),
        productID: product.productID,
        image: imageUrl.trim()
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/images/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        alert("¡Imagen vinculada exitosamente!")
        onRefresh()
        onClose()
      } else {
        const errorData = await response.json()
        alert("Error: " + (errorData.error || "No se pudo guardar"))
      }
    } catch (error) {
      console.error(error)
      alert("Error de conexión al servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 620 }}>
        <div className="modal-header">
          <div>
            <h3>Vincular Imagen</h3>
            <p>Producto: <strong>{product.name}</strong></p>
          </div>
          <button className="btn btn-sm" onClick={onClose} disabled={isSubmitting}>✕</button>
        </div>

        <div style={{ margin: '20px 0' }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>URL de la Imagen (Amazon, WordPress, etc.)</label>
          <input 
            type="text" 
            className="input" 
            placeholder="https://m.media-amazon.com/images/I/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ 
          height: 180, 
          backgroundColor: '#f3f4f6', 
          borderRadius: 8, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden',
          border: '1px dashed #d1d5db',
          marginBottom: 20
        }}>
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Preview" 
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ) : (
            <span style={{ color: '#9ca3af' }}>Vista previa de la imagen</span>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </button>
          <button 
            className="btn btn-green" 
            onClick={handleAddImage} 
            disabled={isSubmitting || !imageUrl}
          >
            {isSubmitting ? 'Guardando...' : '✔ Guardar Imagen'}
          </button>
        </div>
      </div>
    </div>
  )
}