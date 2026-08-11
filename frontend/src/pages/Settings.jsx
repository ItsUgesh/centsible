import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Layout from '../components/Layout'

function Section({ title, description, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-sm disabled:bg-gray-50 disabled:text-gray-400"

export default function Settings() {
  const { user, login: setUser } = useAuth()

  // Profile
  const [name, setName] = useState(user?.name || '')
  const [profileMsg, setProfileMsg] = useState('')
  const [profileError, setProfileError] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)

  // Password
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwMsg, setPwMsg] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSaving, setPwSaving] = useState(false)

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setProfileMsg('')
    setProfileError('')
    setProfileSaving(true)
    try {
      const res = await api.put('/auth/profile', { name })
      setUser(res.data.user)
      setProfileMsg('Profile updated successfully')
    } catch (err) {
      setProfileError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    setPwMsg('')
    setPwError('')
    if (pwForm.newPassword !== pwForm.confirmPassword)
      return setPwError('New passwords do not match')
    if (pwForm.newPassword.length < 6)
      return setPwError('New password must be at least 6 characters')
    setPwSaving(true)
    try {
      await api.put('/auth/password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      })
      setPwMsg('Password updated successfully')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setPwSaving(false)
    }
  }

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || 'U'

  return (
    <Layout>
      <div className="p-6 lg:p-10 max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Settings
          </h1>
          <p className="text-gray-400 mt-1">Manage your account and preferences</p>
        </div>

        <div className="flex flex-col gap-6">

          {/* Profile section */}
          <Section title="Profile" description="Update your display name">
            <form onSubmit={handleProfileSave} className="flex flex-col gap-4">

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {avatarLetter}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>

              <Field label="Full name">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className={inputCls}
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className={inputCls}
                />
                <p className="text-xs text-gray-400">Email cannot be changed</p>
              </Field>

              {profileMsg && <p className="text-emerald-500 text-sm">✓ {profileMsg}</p>}
              {profileError && <p className="text-red-500 text-sm">{profileError}</p>}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-60 text-sm"
                >
                  {profileSaving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </Section>

          {/* Password section — only for email accounts */}
          {user?.provider === 'email' && (
            <Section title="Change Password" description="Make sure your password is at least 6 characters">
              <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
                <Field label="Current password">
                  <input
                    type="password"
                    value={pwForm.currentPassword}
                    onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    className={inputCls}
                  />
                </Field>

                <Field label="New password">
                  <input
                    type="password"
                    value={pwForm.newPassword}
                    onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    className={inputCls}
                  />
                </Field>

                <Field label="Confirm new password">
                  <input
                    type="password"
                    value={pwForm.confirmPassword}
                    onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    className={inputCls}
                  />
                </Field>

                {pwMsg && <p className="text-emerald-500 text-sm">✓ {pwMsg}</p>}
                {pwError && <p className="text-red-500 text-sm">{pwError}</p>}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={pwSaving}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-60 text-sm"
                  >
                    {pwSaving ? 'Updating...' : 'Update password'}
                  </button>
                </div>
              </form>
            </Section>
          )}

          {/* App info */}
          <Section title="About Centsible">
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Version</span>
                <span className="text-gray-700 font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Stack</span>
                <span className="text-gray-700 font-medium">React · Node.js · PostgreSQL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Developer</span>
                <span className="text-gray-700 font-medium">Ugesh Simkhada</span>
              </div>
            </div>
          </Section>

        </div>
      </div>
    </Layout>
  )
}
