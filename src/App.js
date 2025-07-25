import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-gray-600">Harus login terlebih dahulu.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard Bahan Baku</h1>
          <p className="text-sm text-gray-500">👋 Hai, <strong>{user.email}</strong></p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BahanBakuTable />
        <FormTambahBahan onTambah={() => window.location.reload()} />
      </div>
    </div>
  )
}

function BahanBakuTable() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('bahan_baku')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('Gagal ambil data:', error.message)
    } else {
      setData(data)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return
    const { error } = await supabase.from('bahan_baku').delete().eq('id', id)
    if (error) {
      alert('Gagal hapus data: ' + error.message)
    } else {
      fetchData()
    }
  }

  const handleEdit = async (item) => {
    const namaBaru = prompt('Ubah nama:', item.nama)
    const stokBaru = prompt('Ubah stok:', item.stok)
    const minBaru = prompt('Ubah minimum:', item.minimum)
    if (!namaBaru || !stokBaru || !minBaru) return

    const { error } = await supabase
      .from('bahan_baku')
      .update({
        nama: namaBaru,
        stok: parseInt(stokBaru),
        minimum: parseInt(minBaru)
      })
      .eq('id', item.id)

    if (error) {
      alert('Gagal update data: ' + error.message)
    } else {
      fetchData()
    }
  }

  if (data.length === 0) return <p className="text-gray-500">Tidak ada data bahan baku.</p>

  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold mb-2">📦 Data Stok</h2>
      <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Nama</th>
            <th className="px-4 py-2">Stok</th>
            <th className="px-4 py-2">Minimum</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const status = item.stok < item.minimum
              ? <span className="text-red-500 font-semibold">⚠️ Menipis</span>
              : <span className="text-green-600 font-semibold">✅ Aman</span>
            return (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2">{item.nama}</td>
                <td className="px-4 py-2">{item.stok}</td>
                <td className="px-4 py-2">{item.minimum}</td>
                <td className="px-4 py-2">{status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                  >
                    🗑 Hapus
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function FormTambahBahan({ onTambah }) {
  const [nama, setNama] = useState('')
  const [stok, setStok] = useState('')
  const [minimum, setMinimum] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nama || !stok || !minimum) return alert('Semua kolom wajib diisi')
    setLoading(true)

    const { error } = await supabase.from('bahan_baku').insert([
      { nama, stok: parseInt(stok), minimum: parseInt(minimum) }
    ])

    setLoading(false)

    if (error) {
      alert('Gagal tambah data: ' + error.message)
    } else {
      setNama('')
      setStok('')
      setMinimum('')
      onTambah()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">➕ Tambah Bahan Baku</h3>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Nama:</label>
        <input
          className="mt-1 w-full border px-3 py-2 rounded"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Stok:</label>
        <input
          type="number"
          className="mt-1 w-full border px-3 py-2 rounded"
          value={stok}
          onChange={(e) => setStok(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Minimum:</label>
        <input
          type="number"
          className="mt-1 w-full border px-3 py-2 rounded"
          value={minimum}
          onChange={(e) => setMinimum(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Menyimpan...' : 'Tambah'}
      </button>
    </form>
  )
}

export default App