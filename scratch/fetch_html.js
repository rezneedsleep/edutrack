async function test() {
  try {
    const res = await fetch('http://localhost:3000/dashboard/admin/users');
    const body = await res.text();
    const fs = require('fs');
    fs.writeFileSync('scratch/fetch_response.html', body);
    console.log("Saved response html to scratch/fetch_response.html");
  } catch (err) {
    console.error(err);
  }
}
test();
