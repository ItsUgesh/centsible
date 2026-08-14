import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Layout from '../components/Layout'

const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-400 font-medium mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR' }).format(amount || 0)
}

function formatMonth(str) {
  if (!str) return ''
  const [year, month] = str.split('-')
  return new Date(year, month - 1).toLocaleString('default', { month: 'short' })
}

export default function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [monthly, setMonthly] = useState([])
  const [categories, setCategories] = useState([])
  const [recent, setRecent] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, m, c, t, p] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/by-month'),
          api.get('/dashboard/by-category'),
          api.get('/transactions?limit=5'),
          api.get('/dashboard/prediction'),
        ])
        setSummary(s.data)
        setMonthly(m.data.data || [])
        setCategories(c.data.data || [])
        setRecent(t.data.transactions || t.data)
        setPrediction(p.data.prediction)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6 lg:p-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-gray-400 mt-1">Here's your financial overview</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Income" value={formatCurrency(summary?.income)} sub="This month" color="text-emerald-500" />
          <StatCard label="Total Expenses" value={formatCurrency(summary?.expenses)} sub="This month" color="text-red-400" />
          <StatCard label="Balance" value={formatCurrency(summary?.balance)} sub="Income - Expenses" color={summary?.balance >= 0 ? 'text-gray-900' : 'text-red-500'} />
        </div>

        {/* Prediction card */}
        {prediction !== null && (
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-5 mb-8 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-emerald-50 text-sm font-medium">📈 Predicted spending next month</p>
              <p className="text-white text-2xl font-bold mt-0.5">{formatCurrency(prediction)}</p>
              <p className="text-emerald-100 text-xs mt-1">Based on your last 3 months average</p>
            </div>
            <div className="text-4xl opacity-30">🔮</div>
          </div>
        )}

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Bar chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 mb-6">Income vs Expenses</h2>
            {monthly.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthly} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `€${v}`}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6' }}
                  />
                  <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Income" />
                  <Bar dataKey="expenses" fill="#fca5a5" radius={[6, 6, 0, 0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">No data yet — add some transactions</div>
            )}
          </div>

          {/* Pie chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Spending by Category</h2>
            {categories.length > 0 ? (() => {
              const totalSpend = categories.reduce((sum, c) => sum + c.total, 0)
              return (
                <div className="flex items-center gap-4">
                  {/* Donut */}
                  <div className="flex-shrink-0">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie
                          data={categories}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          dataKey="total"
                          nameKey="name"
                          paddingAngle={3}
                        >
                          {categories.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [formatCurrency(value), name]}
                          contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', fontSize: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Legend */}
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    {categories.map((cat, i) => {
                      const pct = totalSpend > 0 ? Math.round((cat.total / totalSpend) * 100) : 0
                      return (
                        <div key={cat.name} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="text-xs text-gray-600 truncate">{cat.icon} {cat.name}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs font-bold text-gray-800">{pct}%</span>
                            <span className="text-xs text-gray-400 w-14 text-right">{formatCurrency(cat.total)}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })() : (
              <div className="flex items-center justify-center h-[180px] text-gray-400 text-sm">No expense data yet</div>
            )}
          </div>

        </div>

        {/* Recent transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="text-base font-semibold text-gray-900">Recent Transactions</h2>
            <Link to="/transactions" className="text-sm text-emerald-500 font-medium hover:text-emerald-600 transition-colors">View all →</Link>
          </div>
          {recent.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {recent.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-base flex-shrink-0">
                      {tx.category?.icon || '💸'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tx.description || tx.category?.name || 'Transaction'}</p>
                      <p className="text-xs text-gray-400">{tx.category?.name || 'Uncategorized'} · {new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              No transactions yet.{' '}
              <Link to="/transactions" className="text-emerald-500 hover:underline">Add your first one →</Link>
            </div>
          )}
        </div>

      </div>
    </Layout>
  )
}