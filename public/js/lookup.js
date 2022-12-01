const lookupPeriod = 60000; // 60000ms = 1 min
window.localStorage.removeItem('pay_token'); // 將pay_token先移除掉
if (window.localStorage.getItem('user_id') === null || window.localStorage.getItem('access_token') === null) {
    Swal.fire({
        icon: 'info',
        title: '請先登入或註冊',
        showConfirmButton: false,
        timer: 1200,
    });
    setTimeout(() => {
        window.location.href = `${DNS}/member.html`;
    }, 1600);
}

const access_token = window.localStorage.getItem('access_token');

const socket = io(CONSUMER_DNS, {
    auth: {
        token: access_token,
    },
    transports: ['websocket'],
});

socket.on('connect', () => {
    socket.emit('lookup');
    setInterval(() => {
        socket.emit('lookup');
    }, lookupPeriod);
});

socket.on('jwt', (jwt) => {
    // console.log('jwt', jwt);
    window.localStorage.setItem('pay_token', jwt); // Save token
});
socket.on('notify', (result) => {
    console.log('Result is', result);
    if (result === STATUS.SUCCESS) {
        if (window.localStorage.getItem('pay_token') !== null) {
            Swal.fire({
                icon: 'success',
                title: '搶購成功',
                showConfirmButton: false,
                timer: 2000,
            });
            // 搶購成功後，導向結帳頁面
            setTimeout(() => {
                window.location.href = `${DNS}/checkout.html`;
            }, 2500);
        } else {
            console.error('雖然使用者有收到成功的通知');
            console.error('但使用者沒有拿到token');
        }
    }
    if (result === STATUS.STANDBY) {
        Swal.fire({
            icon: 'success',
            title: '候補中',
            showConfirmButton: false,
            timer: 2500,
        });
    }
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
    if (result === STATUS.PAID) {
        Swal.fire({
            icon: 'info',
            title: '您已購買成功',
            showConfirmButton: false,
            timer: 2000,
        });
        // 如果使用者購買成功後再進行搶購，會導向戰利品頁
        setTimeout(() => {
            window.location.href = `${DNS}/prize.html`;
        }, 2500);
    }
});
socket.on('connect_error', () => {
    console.error('connect error');
});
