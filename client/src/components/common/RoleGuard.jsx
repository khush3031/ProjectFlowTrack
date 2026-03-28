import { useAuth } from '../../hooks/useAuth'

export default function RoleGuard({ role, children, fallback = null }) {
  const { user } = useAuth()
  if (user?.role !== role) return fallback
  return children
}
