const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public')); // Menghubungkan folder frontend

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Simulasi Database Sederhana di Memori Server
let listBooking = [];

io.on('connection', (socket) => {
  console.log('Pengguna terhubung ke server Konseling Salsa:', socket.id);

  // 1. Fitur Kirim & Terima Pesan Konseling Real-time
  socket.on('send_message', (data) => {
    // Sebarkan pesan ke semua orang yang terhubung di ruang chat
    io.emit('receive_message', {
      sender: data.sender,
      text: data.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  });

  // 2. Fitur Booking Jadwal
  socket.on('new_booking', (bookingData) => {
    listBooking.push(bookingData);
    console.log('Booking baru diterima:', bookingData);
    // Kirim update daftar booking ke semua admin/konselor
    io.emit('update_booking_list', listBooking);
  });

  socket.on('disconnect', () => {
    console.log('Pengguna terputus:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server Konseling Salsa aktif di: http://localhost:${PORT}`);
});