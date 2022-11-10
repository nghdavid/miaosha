const socket = io(PUBLISHER_DNS);
socket.on('url', (url, password) => {
    console.log(url);
    window.location.href = `${url}?hl=${password}`;
});

socket.on('time', (year, month, date, hour, min) => {
    let compareDate = new Date(year, month - 1, date, hour, min);
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
