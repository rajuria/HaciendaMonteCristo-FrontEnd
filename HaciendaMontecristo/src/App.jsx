import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ClienteProductosPage from './pages/ClienteProductosPage'
import CarritoPage from './pages/CarritoPage'
import ConfirmarPedidoPage from './pages/ConfirmarPedidoPage'
import VendedorPanelPage from './pages/VendedorPanelPage'
import PedidosAsignadoPage from './pages/PedidosAsignadoPage'
import AdminBodegaPage from './pages/AdminBodegaPage'
import RevisionCancelacionPage from './pages/RevisionCancelacionPage'
import AdminSistemaClientesPage from './pages/AdminSistemaClientesPage'
import GestionUsuariosPage from './pages/GestionUsuariosPage'
import AsignarPedidosPage from './pages/AsignarPedidosPage'
import ReportesPage from './pages/ReportesPage'
import MantenimientoPage from './pages/MantenimientoPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />

      <Route path="/cliente/productos" element={<ClienteProductosPage />} />
      <Route path="/cliente/carrito" element={<CarritoPage />} />
      <Route path="/cliente/confirmar-pedido" element={<ConfirmarPedidoPage />} />

      <Route path="/vendedor" element={<VendedorPanelPage />} />
      <Route path="/vendedor/pedidos" element={<PedidosAsignadoPage />} />

      <Route path="/admin-bodega" element={<AdminBodegaPage />} />
      <Route path="/admin-bodega/cancelaciones" element={<RevisionCancelacionPage />} />

      <Route path="/admin-sistema/clientes" element={<AdminSistemaClientesPage />} />
      <Route path="/admin-sistema/usuarios" element={<GestionUsuariosPage />} />
      <Route path="/admin-sistema/asignar-pedidos" element={<AsignarPedidosPage />} />
      <Route path="/admin-sistema/reportes" element={<ReportesPage />} />
      <Route path="/admin-sistema/mantenimiento" element={<MantenimientoPage />} />
    </Routes>
  )
}

export default App