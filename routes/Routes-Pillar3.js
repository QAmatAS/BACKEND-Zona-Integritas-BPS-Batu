const express = require('express');
const router = express.Router();
const sampleBPS = require('../models/Model-Pillar3');

// Fungsi untuk mengurutkan dan memperbarui ID rincian kegiatan
const reorderRincianKegiatan = async (doc) => {
    // Pastikan rincianKegiatan ada dan merupakan array
    if (!doc || !doc.rincianKegiatan || !Array.isArray(doc.rincianKegiatan)) {
      console.error("Dokumen atau rincian kegiatan tidak valid.");
      return;
    }

    // Urutkan array berdasarkan ID yang ada saat ini
    doc.rincianKegiatan.sort((a, b) => (a.id || 0) - (b.id || 0));

    // Perbarui ID secara berurutan
    doc.rincianKegiatan.forEach((rincian, index) => {
        rincian.id = index + 1;
    });

    // Simpan dokumen yang telah diperbarui
    await doc.save();
};

// Route untuk mendapatkan semua rencana aksi
router.get('/', async (req, res) => {
    try {
        const samples = await sampleBPS.find({});
        console.log('Semua data rencana aksi berhasil diambil.');
        res.status(200).json(samples);
    } catch (err) {
        console.error('Error saat mengambil data:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route untuk mendapatkan rincian kegiatan berdasarkan ID rencana aksi dan ID rincian kegiatan
router.get('/rincian-by-id/:rencanaAksiId/:rincianKegiatanId', async (req, res) => {
    const { rencanaAksiId, rincianKegiatanId } = req.params;

    try {
        const rencanaAksi = await sampleBPS.findOne(
            { id: parseInt(rencanaAksiId) },
            { 
                rincianKegiatan: { 
                    $elemMatch: { id: parseInt(rincianKegiatanId) } 
                } 
            }
        );

        if (!rencanaAksi || !rencanaAksi.rincianKegiatan || rencanaAksi.rincianKegiatan.length === 0) {
            return res.status(404).json({ message: 'Rincian kegiatan tidak ditemukan.' });
        }

        res.status(200).json(rencanaAksi.rincianKegiatan[0]);
    } catch (err) {
        console.error('Error saat mengambil rincian kegiatan:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route untuk menambahkan rencana aksi baru (dengan validasi duplikasi ID)
router.post('/', async (req, res) => {
    const newRencanaAksi = req.body;

    if (!newRencanaAksi || !newRencanaAksi.rencanaAksi || !newRencanaAksi.id) {
        return res.status(400).json({ message: 'Data rencana aksi tidak valid. Mohon sertakan id dan rencanaAksi.' });
    }

    try {
        // Cek apakah ID sudah ada di database
        const existingRencanaAksi = await sampleBPS.findOne({ id: newRencanaAksi.id });
        if (existingRencanaAksi) {
            return res.status(409).json({ message: `Gagal menambahkan data. Rencana aksi dengan ID ${newRencanaAksi.id} sudah ada.` });
        }

        const createdRencanaAksi = await sampleBPS.create(newRencanaAksi);
        console.log('Rencana aksi baru berhasil ditambahkan.');
        res.status(201).json(createdRencanaAksi);
    } catch (err) {
        console.error('Error saat menambahkan rencana aksi:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route untuk menambahkan rincian kegiatan ke dalam rencana aksi yang sudah ada
router.post('/add-rincian/:id', async (req, res) => {
    const { id } = req.params;
    const newRincianKegiatan = req.body;

    if (!newRincianKegiatan || !newRincianKegiatan.uraian) {
        return res.status(400).json({ message: 'Data rincian kegiatan tidak valid.' });
    }

    try {
        const updatedRencanaAksi = await sampleBPS.findOneAndUpdate(
            { id: parseInt(id) },
            { $push: { rincianKegiatan: newRincianKegiatan } },
            { new: true, runValidators: true }
        );

        if (!updatedRencanaAksi) {
            return res.status(404).json({ message: 'Rencana aksi tidak ditemukan.' });
        }

        // Panggil fungsi untuk mengurutkan dan memperbarui ID
        await reorderRincianKegiatan(updatedRencanaAksi);

        console.log('Rincian kegiatan berhasil ditambahkan.');
        res.status(200).json(updatedRencanaAksi);
    } catch (err) {
        console.error('Error saat menambahkan rincian kegiatan:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route untuk mengupdate rincian kegiatan
router.patch('/update-rincian/:rencanaAksiId/:rincianKegiatanId', async (req, res) => {
    const { rencanaAksiId, rincianKegiatanId } = req.params;
    const updateData = req.body;

    try {
        const updatedRencanaAksi = await sampleBPS.findOneAndUpdate(
            { 
                id: parseInt(rencanaAksiId),
                'rincianKegiatan.id': parseInt(rincianKegiatanId)
            },
            {
                $set: {
                    'rincianKegiatan.$': { ...updateData, id: parseInt(rincianKegiatanId) }
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedRencanaAksi) {
            return res.status(404).json({ message: 'Rencana aksi atau rincian kegiatan tidak ditemukan.' });
        }

        console.log('Rincian kegiatan berhasil diperbarui.');
        res.status(200).json(updatedRencanaAksi);
    } catch (err) {
        console.error('Error saat memperbarui rincian kegiatan:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route untuk menghapus rincian kegiatan
router.delete('/delete-rincian/:rencanaAksiId/:rincianKegiatanId', async (req, res) => {
    const { rencanaAksiId, rincianKegiatanId } = req.params;

    try {
        const updatedRencanaAksi = await sampleBPS.findOneAndUpdate(
            { id: parseInt(rencanaAksiId) },
            { $pull: { rincianKegiatan: { id: parseInt(rincianKegiatanId) } } },
            { new: true }
        );

        if (!updatedRencanaAksi) {
            return res.status(404).json({ message: 'Rencana aksi tidak ditemukan.' });
        }
        
        // Panggil fungsi untuk mengurutkan dan memperbarui ID setelah penghapusan
        await reorderRincianKegiatan(updatedRencanaAksi);

        console.log('Rincian kegiatan berhasil dihapus.');
        res.status(200).json(updatedRencanaAksi);
    } catch (err) {
        console.error('Error saat menghapus rincian kegiatan:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route baru untuk mengupdate data rencana aksi
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedRencanaAksi = await sampleBPS.findOneAndUpdate(
            { id: parseInt(id) },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedRencanaAksi) {
            return res.status(404).json({ message: 'Rencana aksi tidak ditemukan.' });
        }

        console.log('Rencana aksi berhasil diperbarui.');
        res.status(200).json(updatedRencanaAksi);
    } catch (err) {
        console.error('Error saat memperbarui rencana aksi:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route untuk menghapus seluruh dokumen rencana aksi
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await sampleBPS.deleteOne({ id: parseInt(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Rencana aksi tidak ditemukan.' });
        }

        console.log('Rencana aksi berhasil dihapus.');
        res.status(200).json({ message: 'Rencana aksi berhasil dihapus.' });
    } catch (err) {
        console.error('Error saat menghapus rencana aksi:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;