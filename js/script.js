// Kelas Room dan Reservation
class Room {
    constructor(number, capacity) {
        this.number = number;
        this.capacity = capacity;
        this.reservations = []; // Menyimpan daftar reservasi
    }

    // Fungsi untuk mengecek ketersediaan ruangan
    isAvailable(date, startTime, duration) {
        // Ubah waktu menjadi format yang bisa dihitung
        const startDate = new Date(`${date}T${startTime}:00`);
        const endDate = new Date(startDate.getTime() + duration * 60000); // Durasi dalam menit

        // Periksa apakah ada reservasi yang bentrok
        return !this.reservations.some(reservation => {
            const reservedStart = new Date(`${reservation.date}T${reservation.startTime}:00`);
            const reservedEnd = new Date(reservedStart.getTime() + reservation.duration * 60000);
            
            // Cek apakah waktu pemesanan bertabrakan
            return (startDate < reservedEnd && endDate > reservedStart);
        });
    }

    // Menambahkan reservasi ke dalam daftar
    addReservation(reservation) {
        this.reservations.push(reservation);
        saveReservationsToLocalStorage(); // Simpan setelah penambahan
    }
}

// Kelas Reservation
class Reservation {
    constructor(name, roomNumber, date, startTime, duration) {
        this.name = name;
        this.roomNumber = roomNumber;
        this.date = date;
        this.startTime = startTime;
        this.duration = duration;
    }
}

// Daftar Ruangan
const rooms = [
    new Room(101, 30),
    new Room(102, 20),
    new Room(103, 25),
    new Room(104, 40)
];

// Fungsi untuk menampilkan ruangan di halaman utama
function displayRooms() {
    const roomSelect = document.getElementById("roomNumber");
    rooms.forEach(room => {
        const option = document.createElement("option");
        option.value = room.number;
        option.text = `Ruangan ${room.number}`;
        roomSelect.appendChild(option);
    });

    // Ambil data reservasi dari localStorage dan tampilkan
    loadReservationsFromLocalStorage();
}

// Fungsi untuk menyimpan reservasi ke localStorage
function saveReservationsToLocalStorage() {
    const reservationsData = rooms.map(room => ({
        number: room.number,
        reservations: room.reservations
    }));
    localStorage.setItem("rooms", JSON.stringify(reservationsData)); // Menyimpan data ruangan dan reservasi
}

// Fungsi untuk memuat reservasi dari localStorage
function loadReservationsFromLocalStorage() {
    const savedData = localStorage.getItem("rooms");
    if (savedData) {
        const roomsData = JSON.parse(savedData);
        roomsData.forEach(savedRoom => {
            const room = rooms.find(r => r.number === savedRoom.number);
            if (room) {
                room.reservations = savedRoom.reservations.map(reservation => new Reservation(
                    reservation.name,
                    reservation.roomNumber,
                    reservation.date,
                    reservation.startTime,
                    reservation.duration
                ));
            }
        });
    }
}


// Fungsi untuk menampilkan data reservasi dari localStorage
function displayReservations() {
    const reservationsTableBody = document.getElementById("reservations-table-body");
    reservationsTableBody.innerHTML = ""; // Kosongkan tabel untuk memastikan tidak ada data duplikat

    // Ambil data dari localStorage
    const savedData = localStorage.getItem("rooms");

    // Periksa apakah ada data di localStorage
    if (savedData) {
        // Parse data JSON menjadi objek JavaScript
        const roomsData = JSON.parse(savedData);
        let index = 1;

        // Looping melalui setiap ruangan dan reservasinya
        roomsData.forEach(room => {
            room.reservations.forEach(reservation => {
                // Buat baris baru untuk setiap reservasi
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${index++}</td>
                    <td>${reservation.name}</td>
                    <td>${room.number}</td>
                    <td>${reservation.date}</td>
                    <td>${reservation.startTime}</td>
                    <td>${reservation.duration / 60} Jam</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editReservation(${room.number}, '${reservation.date}', '${reservation.startTime}')">Edit</button>
                        <button class="btn btn-info btn-sm" onclick="showReservationInfo(${room.number}, '${reservation.date}', '${reservation.startTime}')">Info</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteReservation(${room.number}, '${reservation.date}', '${reservation.startTime}')">Hapus</button>
                    </td>
                `;

                // Tambahkan baris ke dalam tabel
                reservationsTableBody.appendChild(row);
            });
        });
    } else {
        // Tampilkan pesan jika tidak ada data reservasi
        reservationsTableBody.innerHTML = "<tr><td colspan='7'>Tidak ada data reservasi.</td></tr>";
    }
}

// Fungsi untuk edit reservasi
function editReservation(roomNumber, date, startTime) {
    // Ambil data dari localStorage
    const savedData = localStorage.getItem("rooms");
    const roomsData = JSON.parse(savedData);

    // Cari reservasi yang akan diedit
    roomsData.forEach(room => {
        if (room.number === roomNumber) {
            const reservation = room.reservations.find(r => r.date === date && r.startTime === startTime);
            if (reservation) {
                // Di sini bisa menambahkan logika untuk menampilkan form edit, misalnya mengisi input form dengan data reservasi.
                // Atau bisa redireksi ke halaman edit tertentu
                alert(`Edit Reservasi:\nNama: ${reservation.name}\nRuangan: ${room.number}\nTanggal: ${reservation.date}\nWaktu Mulai: ${reservation.startTime}\nDurasi: ${reservation.duration / 60} Jam`);
            }
        }
    });
}

// Fungsi untuk menampilkan info tentang reservasi
function showReservationInfo(roomNumber, date, startTime) {
    // Ambil data dari localStorage
    const savedData = localStorage.getItem("rooms");
    const roomsData = JSON.parse(savedData);

    // Cari reservasi yang ingin ditampilkan infonya
    roomsData.forEach(room => {
        if (room.number === roomNumber) {
            const reservation = room.reservations.find(r => r.date === date && r.startTime === startTime);
            if (reservation) {
                // Menampilkan detail informasi tentang reservasi
                alert(`Informasi Reservasi:\nNama: ${reservation.name}\nRuangan: ${room.number}\nTanggal: ${reservation.date}\nWaktu Mulai: ${reservation.startTime}\nDurasi: ${reservation.duration / 60} Jam`);
            }
        }
    });
}

// Panggil fungsi displayReservations saat halaman dimuat
window.addEventListener('DOMContentLoaded', displayReservations);


// Fungsi untuk menghapus reservasi
function deleteReservation(roomNumber, date, startTime) {
    // Ambil data dari localStorage
    const savedData = localStorage.getItem("rooms");
    const roomsData = JSON.parse(savedData);

    // Cari ruangan yang sesuai dan reservasi yang akan dihapus
    roomsData.forEach(room => {
        if (room.number === roomNumber) {
            const reservationIndex = room.reservations.findIndex(r => r.date === date && r.startTime === startTime);
            if (reservationIndex !== -1) {
                // Hapus reservasi dari daftar
                room.reservations.splice(reservationIndex, 1);

                // Simpan data terbaru ke localStorage
                localStorage.setItem("rooms", JSON.stringify(roomsData));

                // Tampilkan pesan konfirmasi
                alert('Reservasi berhasil dihapus.');

                // Perbarui tampilan tabel
                displayReservations();
            } else {
                alert('Reservasi tidak ditemukan.');
            }
        }
    });
}

// Panggil fungsi displayReservations saat halaman dimuat
window.addEventListener('DOMContentLoaded', displayReservations);


// Menambahkan reservasi baru
document.getElementById("reservation-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const roomNumber = document.getElementById("roomNumber").value;
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("startTime").value;
    const duration = parseInt(document.getElementById("duration").value) * 60; // Durasi dalam menit

    if (isNaN(duration) || duration <= 0) {
        alert('Durasi tidak valid.');
        return;
    }

    const room = rooms.find(r => r.number == roomNumber);

    if (room && room.isAvailable(date, startTime, duration)) {
        const reservation = new Reservation(name, roomNumber, date, startTime, duration);
        room.addReservation(reservation);
        alert('Reservasi berhasil dibuat!');
    } else {
        alert('Ruangan tidak tersedia pada waktu tersebut.');
    }
});

// Panggil fungsi displayRooms dan displayReservations saat halaman dimuat
window.onload = function() {
    displayRooms(); // Untuk halaman reservasi baru
    if (document.getElementById("reservations-table-body")) {
        displayReservations(); // Untuk halaman daftar reservasi
    }
};