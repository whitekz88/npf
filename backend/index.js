const express = require('express');
const cors = require('cors');
const iconv = require('iconv-lite');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());

const PORT = 3000;

const mongoUrl = 'mongodb://localhost:27017'; //mongodb://belosh_mongo:npfanal2025@db:27017/?authSource=admin /
const dbName = 'npf';
const collectionName = 'npf_events';

let collection;

function decodeAsk(str) {
  return iconv.decode(Buffer.from(str || '', 'latin1'), 'utf8');
}

// Подключаемся к MongoDB и только потом запускаем сервер
MongoClient.connect(mongoUrl)
  .then(client => {
    console.log('✅ Подключено к MongoDB');

    const db = client.db(dbName);
    collection = db.collection(collectionName);

    // запускаем сервер только после подключения
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен: http://localhost:${PORT}/track`);
    });

    // Роуты определяем после подключения
    app.get('/track', async (req, res) => {
      const raw = req.query;
      const correctedAsk = decodeAsk(raw.ask);
      try {
        const doc = {
          error: raw.error === 'true',
          name_copy: raw.name_copy || null,
          profileid: raw.profileid || null,
          search_engine: raw.search_engine || null,
          position: raw.position ? parseInt(raw.position) : null,
          domain: raw.domain || null,
          ask: correctedAsk || null,
          url: raw.url || null,
          date_time: raw.date_time ? Number(raw.date_time) : 0,
          lendomain: raw.lendomain ? parseInt(raw.lendomain) : null,
          created_at: new Date(),
      };
        await collection.insertOne(doc);
        console.log(`[✓] Данные записаны в MongoDB: profileid=${raw.profileid}`);
        res.sendStatus(200);
      } catch (err) {
        console.error('❌ Ошибка при записи в MongoDB:', err);
        res.sendStatus(500);
      }
    });

    app.get('/api/clicks', async (req, res) => {
      const { ask, from, to } = req.query;
      const query = {};

      if (ask) {
        query.ask = { $regex: ask, $options: 'i' };
      }

      if (from || to) {
        query.date_time = {};
        if (from) query.date_time.$gte = Number(from);
        if (to) query.date_time.$lte = Number(to);
      }

      try {
        const docs = await collection
          .aggregate([
            { $match: query },
            { $group: { _id: '$ask', count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ])
          .toArray();

        const results = docs.map(d => ({ ask: d._id, count: d.count }));
        res.json({ results });
      } catch (err) {
        console.error('❌ Ошибка при подсчёте:', err);
        res.status(500).json({ error: 'Ошибка при подсчёте' });
      }
    });
  })
  .catch(err => {
    console.error('❌ Не удалось подключиться к MongoDB:', err);
  });
