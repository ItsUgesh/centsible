import { useEffect, useState } from 'react'
import api from '../services/api'
import Layout from '../components/Layout'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR' }).format(amount || 0)
}

const EMPTY_FORM = {
  type: 'expense',
  amount: '',
  description: '',
  categoryId: '',
  date: new Date().toISOString().split('T')[0],
}

const EMOJI_LIST = [
  '🍔','🍕','🍜','🛒','🏠','🚗','💊','🎓','✈️','🎬',
  '👕','💡','📱','💻','🎮','🏋️','🐶','💈','🎁','💰',
  '💵','📈','🏦','💳','🧾','🧹','🌊','🌿','🎵','⚽',
  '🏥','🚌','🍷','☕','🛍️','📦','🔧','💼','🧴','🎨',
]

const EMPTY_CAT_FORM = { name: '', icon: '📦' }

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [filterType, setFilterType] = useState('')
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [filterMonth, setFilterMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  // Category modal state
  const [showCatModal, setShowCatModal] = useState(false)
  const [catForm, setCatForm] = useState(EMPTY_CAT_FORM)
  const [catSaving, setCatSaving] = useState(false)
  const [catError, setCatError] = useState('')

  const fetchTransactions = async () => {
    try {
      const params = new URLSearchParams()
      if (filterType) params.append('type', filterType)
      if (filterMonth) params.append('month', filterMonth)
      const res = await api.get(`/transactions?${params}`)
      setTransactions(res.data.transactions || res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    const res = await api.get('/categories')
    setCategories(Array.isArray(res.data) ? res.data : res.data.categories || [])
  }

  useEffect(() => { fetchCategories() }, [])
  useEffect(() => { fetchTransactions() }, [filterType, filterMonth])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setError('')
    setShowModal(true)
  }

  const openEdit = (tx) => {
    setEditing(tx)
    setForm({
      type: tx.type,
      amount: tx.amount,
      description: tx.description || '',
      categoryId: tx.categoryId || '',
      date: new Date(tx.date).toISOString().split('T')[0],
    })
    setError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditing(null)
    setForm(EMPTY_FORM)
    setError('')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      return setError('Please enter a valid amount')
    setSaving(true)
    setError('')
    try {
      if (editing) {
        await api.put(`/transactions/${editing.id}`, form)
      } else {
        await api.post('/transactions', form)
      }
      closeModal()
      fetchTransactions()
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/transactions/${deleteId}`)
      setDeleteId(null)
      fetchTransactions()
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!catForm.name.trim()) return setCatError('Name is required')
    setCatSaving(true)
    setCatError('')
    try {
      await api.post('/categories', catForm)
      await fetchCategories()
      setShowCatModal(false)
      setCatForm(EMPTY_CAT_FORM)
    } catch (err) {
      setCatError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setCatSaving(false)
    }
  }

  return (
    <Layout>
      <div className="p-6 lg:p-10 max-w-5xl mx-auto">

        {/* Header */}
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Transactions
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">Manage your income and expenses</p>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => { setCatForm(EMPTY_CAT_FORM); setCatError(''); setShowCatModal(true) }}
              className="flex-1 sm:flex-none border border-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm text-center justify-center flex items-center whitespace-nowrap"
            >
              + Category
            </button>
            <button
              onClick={openAdd}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold px-4 sm:px-5 py-2.5 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 shadow-sm text-sm whitespace-nowrap"
            >
              <span>+</span> Add Transaction
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          {/* Custom Type Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white transition"
            >
              <span>{filterType === 'income' ? 'Income' : filterType === 'expense' ? 'Expense' : 'All types'}</span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showTypeDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showTypeDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowTypeDropdown(false)} />
                <div className="absolute left-0 mt-1.5 w-36 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
                  {[
                    { value: '', label: 'All types' },
                    { value: 'income', label: 'Income', icon: '↗' },
                    { value: 'expense', label: 'Expense', icon: '↘' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFilterType(option.value)
                        setShowTypeDropdown(false)
                      }}
                      className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between transition ${
                        filterType === option.value
                          ? 'bg-emerald-50 text-emerald-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{option.label}</span>
                      {filterType === option.value && <span className="text-emerald-500 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <input
            type="month"
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white w-36 sm:w-40"
          />
          {(filterType || filterMonth !== `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`) && (
            <button
              onClick={() => {
                setFilterType('')
                const now = new Date()
                setFilterMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
              }}
              className="text-sm text-gray-400 hover:text-gray-600 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Transactions list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-7 h-7 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : transactions.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors group gap-2">
                  {/* Left info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                      {tx.category?.icon || '💸'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {tx.description || tx.category?.name || 'Transaction'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {tx.category?.name || 'Uncategorized'} · {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Right amount & actions */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className={`text-sm sm:text-base font-semibold whitespace-nowrap text-right ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                    <div className="flex items-center gap-0.5 sm:gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(tx)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors" title="Edit">✏️</button>
                      <button onClick={() => setDeleteId(tx.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400 text-sm">
              No transactions found.{' '}
              <button onClick={openAdd} className="text-emerald-500 hover:underline">Add your first one →</button>
            </div>
          )}
        </div>
      </div>


      {/* ── Add/Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {editing ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              {/* Type toggle */}
              <div className="flex rounded-xl overflow-hidden border border-gray-200">
                {['expense', 'income'].map((t) => (
                  <button key={t} type="button"
                    onClick={() => setForm({ ...form, type: t, categoryId: '' })}
                    className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-colors ${
                      form.type === t
                        ? t === 'income' ? 'bg-emerald-500 text-white' : 'bg-red-400 text-white'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}>
                    {t === 'income' ? '↑ Income' : '↓ Expense'}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (€)</label>
                <input type="number" step="0.01" min="0" value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Grocery shopping"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select value={form.categoryId}
                  onChange={e => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition bg-white">
                  <option value="">Select category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                <input type="date" value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-60">
                  {saving ? 'Saving...' : editing ? 'Save changes' : 'Add transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Category Modal ── */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                New Category
              </h2>
              <button onClick={() => setShowCatModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <form onSubmit={handleAddCategory} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category name</label>
                <input type="text" value={catForm.name}
                  onChange={e => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g. Subscriptions"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pick an emoji</label>
                <div className="grid grid-cols-10 gap-1.5 p-3 bg-gray-50 rounded-xl max-h-40 overflow-y-auto">
                  {EMOJI_LIST.map((emoji) => (
                    <button key={emoji} type="button"
                      onClick={() => setCatForm({ ...catForm, icon: emoji })}
                      className={`text-xl p-1.5 rounded-lg transition-colors ${
                        catForm.icon === emoji ? 'bg-emerald-100 ring-2 ring-emerald-400' : 'hover:bg-gray-200'
                      }`}>
                      {emoji}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Selected: {catForm.icon}</p>
              </div>
              {catError && <p className="text-red-500 text-sm">{catError}</p>}
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowCatModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={catSaving}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-60">
                  {catSaving ? 'Saving...' : 'Create category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <p className="text-4xl mb-4">🗑️</p>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete transaction?</h3>
            <p className="text-gray-400 text-sm mb-6">This can't be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete}
                className="flex-1 bg-red-400 text-white font-semibold py-2.5 rounded-xl hover:bg-red-500 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}