import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'))

  if (!usuarioGuardado) {
    return <Navigate to="/" replace />
  }

  return children
}