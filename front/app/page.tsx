import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Фильтры аналитики</h1>
      <ul className="space-y-2">
        <li>
          <Link href="/filters/by-ask" className="text-blue-600 underline">
            Количество кликов по запросу
          </Link>
        </li>
        {/* Добавим другие позже */}
      </ul>
    </main>
  );
}
