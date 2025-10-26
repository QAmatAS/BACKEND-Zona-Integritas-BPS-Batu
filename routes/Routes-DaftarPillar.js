const express = require('express');
const router = express.Router();
const DaftarPillar = require('../models/Model-DaftarPillar');
const mongoose = require('mongoose');

// Get all Pillar
router.get('/', async (req, res) => {
    try {
        const pillar = await DaftarPillar.find({});

        console.log('All Pillar in the collection:');
        res.status(200).json(pillar);
        console.log(pillar);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get Pillar by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pillar = await DaftarPillar.find({id: parseInt(id)});

        console.log('All Pillar in the collection:');
        res.status(200).json(pillar);
        console.log(pillar);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//Post New Pillar
router.post('/', async (req, res) => {
    const { id, namaPillar, linkFolder } = req.body;

    if (!id || !namaPillar) {
        return res.status(400).json({ message: 'Data Pillar tidak valid. Mohon sertakan id dan namaPillar.' });
    }

    try {
        // Cek apakah ID sudah ada di database
        const existingPillar = await DaftarPillar.findOne({ id: id });
        if (existingPillar) {
            return res.status(409).json({ message: `Gagal menambahkan data. Pillar dengan ID ${id} sudah ada.` });
        }

        const newPillar = { id, namaPillar, linkFolder };
        const createdPillar = await DaftarPillar.create(newPillar);
        console.log('Pillar baru berhasil ditambahkan.');
        res.status(201).json(createdPillar);
    } catch (err) {
        console.error('Error saat menambahkan Pillar:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//Delete Pillar by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await DaftarPillar.deleteOne({ id: parseInt(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Pillar tidak ditemukan.' });
        }

        console.log('Pillar berhasil dihapus.');
        res.status(200).json({ message: 'Pillar berhasil dihapus.' });
    } catch (err) {
        console.error('Error saat menghapus pillar:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//Patch Pillar by ID
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedPillar = await DaftarPillar.findOneAndUpdate(
            { id: parseInt(id) },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedPillar) {
            return res.status(404).json({ message: 'Pillar tidak ditemukan.' });
        }

        console.log('Pillar berhasil diperbarui.');
        res.status(200).json(updatedPillar);
    } catch (err) {
        console.error('Error saat memperbarui pillar:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;