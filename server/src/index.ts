import express from 'express';
import cors from 'cors';
import influencerRoutes from './routes/influencers';
import criteriaRoutes from './routes/criteria';

// Inisialisasi aplikasi Express (hanya sekali)
const app = express();
const PORT = process.env.PORT || 3001; // Gunakan port dari environment atau default 3001

// Konfigurasi CORS untuk mengizinkan permintaan dari Vercel
const corsOptions = {
  origin: 'https://spk-mini-project.vercel.app', // Pastikan URL Vercel Anda benar
  optionsSuccessStatus: 200 
};

// Terapkan Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Gunakan Rute API
app.use('/api/influencers', influencerRoutes);
app.use('/api/criteria', criteriaRoutes);

// Route pengetesan
app.get('/', (req, res) => {
  res.send('🎉 Server SPK Influencer berjalan!');
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});