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

const socket = io(PUBLISHER_DNS, { transports: ['websocket'] });
socket.on('connect', () => {
    $('#backup').hide();
    $('#timer').show();
});
socket.on('connect_error', () => {
    Swal.fire({
        icon: 'info',
        title: '搶購活動尚未開始',
        showConfirmButton: false,
        timer: 2000,
    });
    setTimeout(() => {
        window.location.href = `${DNS}/main.html`;
    }, 2000);
});
socket.on('url', (url, password) => {
    console.log(url);
    if (window.localStorage.getItem('user_id') && window.localStorage.getItem('access_token')) {
        window.location.href = `${url}?hl=${password}`;
    }
});

socket.on('time', (year, month, date, hour, min, sec) => {
    let compareDate = new Date(year, month - 1, date, hour, min, sec);
    let timer = setInterval(function () {
        timeBetweenDates(compareDate);
    }, 1000);
});

function timeBetweenDates(toDate) {
    let dateEntered = toDate;
    let now = new Date();
    let difference = dateEntered.getTime() - now.getTime();

    if (difference <= 0) {
        // Timer done
        clearInterval(timer);
    } else {
        let seconds = Math.floor(difference / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);

        hours %= 24;
        minutes %= 60;
        seconds %= 60;

        // $('#days').text(days);
        $('#hours').text(hours);
        $('#minutes').text(minutes);
        $('#seconds').text(seconds);
    }
}
