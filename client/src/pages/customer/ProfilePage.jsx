import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';

export function ProfilePage() {
  const { user, reload } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [msg, setMsg] = useState('');

  async function save(e) {
    e.preventDefault();
    await api.patch('/auth/profile', form);
    await reload();
    setMsg('Saved');
  }

  return (
    <form className="card mx-auto max-w-lg space-y-3 p-6" onSubmit={save}>
      <h1 className="font-display text-3xl">Profile</h1>
      <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <textarea className="input min-h-[90px]" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <button className="btn-primary">Save</button>
      {msg && <p className="text-sm text-brand-700">{msg}</p>}
    </form>
  );
}
