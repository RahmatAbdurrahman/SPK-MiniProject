import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET all influencers (sudah ada)
router.get('/', async (req, res) => {
  try {
    const influencers = await prisma.influencer.findMany();
    res.json(influencers);
  } catch (error) {
    res.status(500).json({ error: 'Tidak dapat mengambil data influencers' });
  }
});

// === TAMBAHKAN KODE DI BAWAH INI ===

// POST a new influencer
router.post('/', async (req, res) => {
  try {
    // Mengambil data dari body request yang dikirim oleh klien
    const {
      name,
      category,
      followers,
      engagement,
      brandFit,
      cost,
      experience,
      description,
    } = req.body;

    // Membuat data baru di database menggunakan Prisma
    const newInfluencer = await prisma.influencer.create({
      data: {
        name,
        category,
        followers,
        engagement,
        brandFit,
        cost,
        experience,
        description,
      },
    });

    // Mengirim kembali data yang baru dibuat dengan status 201 (Created)
    res.status(201).json(newInfluencer);
  } catch (error) {
    // Menangani jika terjadi error (misalnya, data tidak valid)
    res.status(500).json({ error: 'Gagal menambahkan influencer baru' });
  }
});

// PUT (update) an existing influencer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Mengambil ID dari parameter URL
    const dataToUpdate = req.body; // Mengambil data baru dari body request

    const updatedInfluencer = await prisma.influencer.update({
      where: { id: id }, // Mencari influencer berdasarkan ID
      data: dataToUpdate, // Menerapkan data baru
    });

    res.json(updatedInfluencer);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui data influencer' });
  }
});

// DELETE an influencer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Mengambil ID dari parameter URL

    await prisma.influencer.delete({
      where: { id: id }, // Menghapus influencer berdasarkan ID
    });

    res.status(204).send(); // Mengirim respons "No Content" yang menandakan sukses
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus data influencer' });
  }
});


// === BATAS AKHIR KODE TAMBAHAN ===

export default router;