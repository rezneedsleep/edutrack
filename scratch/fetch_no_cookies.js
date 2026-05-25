async function test() {
  try {
    const res = await fetch('http://localhost:3000/dashboard/admin/users', {
      redirect: 'manual'
    });
    console.log("Status:", res.status);
    console.log("Location header:", res.headers.get('location'));
  } catch (err) {
    console.error(err);
  }
}
test();
