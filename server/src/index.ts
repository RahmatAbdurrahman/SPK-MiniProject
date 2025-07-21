import express from 'express';
import cors from 'cors';
import influencerRoutes from './routes/influencers';
// Impor rute criteria yang baru dibuat
import criteriaRoutes from './routes/criteria';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/influencers', influencerRoutes);
// Gunakan rute criteria untuk semua request yang diawali dengan /api/criteria
app.use('/api/criteria', criteriaRoutes);

app.get('/', (req, res) => {
  res.send('🎉 Selamat! Server backend Anda sudah berjalan!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});