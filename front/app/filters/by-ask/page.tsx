'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ByAskPage() {
  const [ask, setAsk] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState<{ ask: string; count: number }[] | null>(null);

  const handleSubmit = async () => {
    if (!ask && !from && !to) return;

    try {
      const res = await axios.get('http://localhost:3000/api/clicks', {
        params: {
          ask,
          from: from ? new Date(from).getTime() : undefined,
          to: to ? new Date(to).getTime() : undefined,
        },
      });
      setResults(res.data.results);
    } catch (err) {
      console.error(err);
      setResults(null);
    }
  };

  return (
    <main className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">Клики по поисковому запросу</h1>

      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Поисковый запрос"
          className="border w-full p-2 rounded"
          value={ask}
          onChange={(e) => setAsk(e.target.value)}
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

      {results && (
        <ul className="text-lg font-semibold space-y-1">
          {results.map(({ ask, count }) => (
            <li key={ask}>
              {ask} - <span className="text-blue-600">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
