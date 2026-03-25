export default function AprobarClienteModal() {
  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 620 }}>
        <div className="modal-header">
          <div>
            <h3>Aprobar Cliente</h3>
            <p>Asegúrate de que el cliente cumple con los requisitos antes de aprobarlo.</p>
          </div>
          <button className="btn btn-sm">✕</button>
        </div>

        <div style={{ margin: '26px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <input type="checkbox" />
          <label style={{ fontWeight: 700 }}>Otorgar crédito a este cliente</label>
        </div>

        <div className="modal-actions">
          <button className="btn">Cancelar</button>
          <button className="btn btn-green">✔ Aprobar Cliente</button>
        </div>
      </div>
    </div>
  )
}