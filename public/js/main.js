const hour = 1;
const ttl = hour * 60 * 60 * 1000;
if (getWithExpiry('has_come') === null) {
    setWithExpiry('has_come', 1, ttl);
    Swal.fire({
        icon: 'info',
        title: '規則說明',
    });
}
