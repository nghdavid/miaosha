const hour = 1;
const ttl = hour * 60 * 60 * 1000;
if (getWithExpiry('has_come') === null) {
    setWithExpiry('has_come', 1, ttl);
    Swal.fire({
        title: '網站說明',
        html: `<img width="400px" src="image/rules.png" alt=""/>`
    });
}
