// 檢查是否有pay_token，若無則跳出通知，並轉去主頁
if (!window.localStorage.getItem('pay_token')) {
    Swal.fire({
        icon: 'info',
        text: `您沒有購買資格`,
    });
    setTimeout(() => {
        window.location.href = `${DNS}/main.html`;
    }, 1600);
}

const access_token = window.localStorage.getItem('access_token');
const socket = io(CONSUMER_DNS, {
    auth: {
        token: access_token,
    },
    transports: ['websocket'],
});

socket.on('notify', (result) => {
    console.log('Result is', result);
    if (result === STATUS.FAIL) {
        window.localStorage.removeItem('pay_token'); // 如果使用者逾時未付款，將pay_token移除掉
        Swal.fire({
            icon: 'info',
            title: '逾時未付款，搶購失敗',
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

$('form').on('submit', function (event) {
    event.preventDefault();

    const phone = $('#phone').val();
    const address = $('#address').val();

    // fix keyboard issue in iOS device
    forceBlurIos();

    const tappayStatus = TPDirect.card.getTappayFieldsStatus();

    // Check TPDirect.card.getTappayFieldsStatus().canGetPrime before TPDirect.card.getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('can not get prime');
        return;
    }

    // Get prime
    TPDirect.card.getPrime(async (result) => {
        // alert('get prime ' + result.card.prime);
        if (result.status !== 0) {
            alert('get prime error ' + result.msg);
            return;
        }
        // Fetch post request to backend server
        const payToken = window.localStorage.getItem('pay_token');

        // Post request to Checkout api
        const url = `${GENERAL_DNS}/api/${apiVersion}/order/checkout`;
        // Checkout api request body
        const body = {
            prime: result.card.prime,
            phone,
            address,
        };
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${payToken}`,
            },
            body: JSON.stringify(body),
        });

        const orderData = await res.json();
        // 處理回傳結果
        if (orderData.error) {
            Swal.fire({
                icon: 'info',
                text: `${orderData.error}`,
            });
            setTimeout(() => {
                window.location.href = `${DNS}/main.html`;
            }, 3600);
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `${orderData.message}`,
            });
            // 成功購買後會導向戰利品頁
            setTimeout(() => {
                window.location.href = `${DNS}/prize.html`;
            }, 3600);
        }
    });
});
