const STATUS = {
    FAIL: -1,
    STANDBY: 0,
    SUCCESS: 1,
    PAID: 2,
};
const access_token = window.localStorage.getItem('access_token');

const socket = io(CONSUMER_DNS, {
    auth: {
        token: access_token,
    },
});

socket.on('notify', (result) => {
    console.log('Result is', result);
    if (result === STATUS.FAIL) {
        Swal.fire({
            icon: 'info',
            title: '搶購失敗',
            showConfirmButton: false,
            timer: 2000,
        });
        // 搶購失敗後，導向失敗頁面
        setTimeout(() => {
            window.location.href = `${DNS}/failure.html`;
        }, 2500);
    }
});
socket.on('connect_error', () => {
    console.error('connect error');
});
