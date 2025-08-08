'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ByCopyPage() {
  const [nameCopy, setNameCopy] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [count, setCount] = useState<number | null>(null);

  const handleSubmit = async () => {
    const trimmed = nameCopy.trim();
    if (!trimmed) return;

    try {
      const res = await axios.get('http://localhost:3000/api/clicks-by-copy', {
        params: {
          name_copy: trimmed,
          from: from ? new Date(from).getTime() : undefined,
          to: to ? new Date(to).getTime() : undefined,
        },
      });
      setCount(res.data.count);
    } catch (err) {
      console.error(err);
      setCount(null);
    }
  };

  return (
    <main className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">Клики по копии программы</h1>

      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Название копии"
          className="border w-full p-2 rounded"
          value={nameCopy}
          onChange={(e) => setNameCopy(e.target.value)}
        />

        <div className="flex gap-2">
          <input
            type="date"
            className="border p-2 rounded w-1/2"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 rounded w-1/2"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Показать
        </button>
      </div>

      {count !== null && (
        <p className="text-lg font-semibold">
          Всего кликов: <span className="text-blue-600">{count}</span>
        </p>
      )}
    </main>
  );
}
