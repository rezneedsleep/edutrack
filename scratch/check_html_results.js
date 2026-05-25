const fs = require('fs');
const html = fs.readFileSync('scratch/fetch_response.html', 'utf8');

console.log("HTML length:", html.length);
console.log("Contains 'Halaman Tidak Ditemukan':", html.includes('Halaman Tidak Ditemukan'));
console.log("Contains 'Kelola Pengguna':", html.includes('Kelola Pengguna'));
console.log("Contains 'USER MANAGEMENT':", html.includes('USER MANAGEMENT'));
console.log("Contains 'daftar-user' or table headers:", html.includes('Role') || html.includes('Pengguna'));
