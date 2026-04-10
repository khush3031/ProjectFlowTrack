import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateMyProfileApi } from '../../api/userApi'
import { useAuth } from '../../hooks/useAuth'
import { toast } from '../../utils/toast'

function EyeIcon({ visible }) {
  return visible ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
}

function PasswordField({ label, value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-[#4a5568]">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className={`w-full bg-[#f7f9fc] border rounded-sm px-3.5 py-2.5 pr-10 text-[14px] focus:outline-none focus:border-primary transition-colors ${error ? 'border-red-400' : 'border-[#e2e8f0]'}`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0aec0] hover:text-[#4a5568] transition-colors"
          tabIndex={-1}
        >
          <EyeIcon visible={show} />
        </button>
      </div>
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  )
}

export default function Profile() {
  const { user, fetchMe, logout } = useAuth()
  const navigate = useNavigate()

  const [name, setName]               = useState(user?.name || '')
  const [currentPassword, setCurrent] = useState('')
  const [newPassword, setNew]         = useState('')
  const [confirmPassword, setConfirm] = useState('')
  const [saving, setSaving]           = useState(false)
  const [errors, setErrors]           = useState({})

  const handleSave = async (e) => {
    e.preventDefault()
    setErrors({})

    const errs = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (newPassword || currentPassword) {
      if (!currentPassword) errs.currentPassword = 'Enter your current password'
      if (!newPassword) errs.newPassword = 'Enter a new password'
      else if (newPassword.length < 6) errs.newPassword = 'Must be at least 6 characters'
      if (newPassword && newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
    }
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const payload = { name: name.trim() }
    if (newPassword) {
      payload.currentPassword = currentPassword
      payload.newPassword = newPassword
    }

    try {
      setSaving(true)
      const { data } = await updateMyProfileApi(payload)
      if (data.sessionInvalidated) {
        toast.success('Password changed — signing you out of all devices')
        await logout()
        navigate('/login', { replace: true })
        return
      }
      await fetchMe()
      toast.success('Profile updated')
      setCurrent('')
      setNew('')
      setConfirm('')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile'
      toast.error(msg)
      if (msg.toLowerCase().includes('current password')) {
        setErrors({ currentPassword: msg })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a202c]">Profile</h1>
        <p className="text-[13px] text-[#4a5568] mt-1">Manage your name and password</p>
      </div>

      <div className="bg-white border border-[#e2e8f0] rounded-lg p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#e2e8f0]">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-[#1a202c] text-[16px]">{user?.name}</p>
            <p className="text-[13px] text-[#718096]">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#edf2f7] text-[#4a5568]">
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#4a5568]">Display name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className={`bg-[#f7f9fc] border rounded-sm px-3.5 py-2.5 text-[14px] text-[#1a202c] focus:outline-none focus:border-primary transition-colors ${errors.name ? 'border-red-400' : 'border-[#e2e8f0]'}`}
              placeholder="Your name"
            />
            {errors.name && <p className="text-[12px] text-red-500">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#4a5568]">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-[#edf2f7] border border-[#e2e8f0] rounded-sm px-3.5 py-2.5 text-[14px] text-[#a0aec0] cursor-not-allowed"
            />
            <p className="text-[12px] text-[#a0aec0]">Email cannot be changed</p>
          </div>

          <div className="border-t border-[#e2e8f0] pt-5 mt-1">
            <p className="text-[13px] font-semibold text-[#4a5568] mb-4">Change password <span className="font-normal text-[#a0aec0]">(optional)</span></p>

            <div className="flex flex-col gap-4">
              <PasswordField
                label="Current password"
                value={currentPassword}
                onChange={e => setCurrent(e.target.value)}
                placeholder="Enter current password"
                error={errors.currentPassword}
              />
              <PasswordField
                label="New password"
                value={newPassword}
                onChange={e => setNew(e.target.value)}
                placeholder="New password (min 6 chars)"
                error={errors.newPassword}
              />
              <PasswordField
                label="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat new password"
                error={errors.confirmPassword}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary py-2.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
