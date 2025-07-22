import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET all criteria
router.get('/', async (req, res) => {
  try {
    const criteria = await prisma.criterion.findMany();
    // Tambahkan pengecekan ini
    if (!criteria || criteria.length === 0) {
      return res.status(404).json({ error: 'Data kriteria tidak ditemukan' });
    }
    res.json(criteria);
  } catch (error) {
    res.status(500).json({ error: 'Tidak dapat mengambil data kriteria' });
  }
});
// PUT (update) weights for all criteria
router.put('/', async (req, res) => {
  try {
    const criteriaToUpdate: { id: string; weight: number }[] = req.body;

    const updatePromises = criteriaToUpdate.map(criterion =>
      prisma.criterion.update({
        where: { id: criterion.id },
        data: { weight: criterion.weight },
      })
    );

    await prisma.$transaction(updatePromises);

    res.json({ message: 'Bobot kriteria berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui bobot kriteria' });
  }
});

export default router;