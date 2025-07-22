import express from 'express';
import cors from 'cors';
import influencerRoutes from './routes/influencers';
import criteriaRoutes from './routes/criteria';

const app = express();
const PORT = process.env.PORT || 3001;

// Gunakan CORS dengan konfigurasi default yang lebih permisif
app.use(cors()); 
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