const mongoose = require('mongoose');

// Define the schema for the nested 'rincianKegiatan' subdocuments.
const RincianKegiatanSchema = new mongoose.Schema({
  id: Number,
  uraian: String,
  linkLaporanKegiatan: String,
  output: String,
  jumlah: Number,
  quarter: String,
  pic: String,
  keterangan: String,
  // Menambahkan properti baru untuk realisasi
  realisasiQuarter: String,
  realisasiJumlah: Number
}, { _id: false });

// Define the schema for the main 'SOP' collection.
const RencanaAksiSchema = new mongoose.Schema({
  id: Number,
  linkLaporanAksi: String,
  rencanaAksi: String,
  rincianKegiatan: [RincianKegiatanSchema]
}, { collection: 'PillarEnam' });

// Create and export the SOP model based on the main schema.
const SampleBPS = mongoose.model('Pillarenam', RencanaAksiSchema);

module.exports = SampleBPS;