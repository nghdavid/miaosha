function getRandomInt(max, pad) {
    const randomNum = Math.floor(Math.random() * max);
    return String(randomNum).padStart(pad, '0');
}
// This function generate order number which consists of date, hour and six random number
// For example, 2022092017999999
const generateOrderNum = (maxNumber, pad) => {
    const today = new Date();
    const hour = String(today.getHours()).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = today.getFullYear();
    const date = `${year}${month}${day}${hour}`;
    const orderNum = `${date}${getRandomInt(maxNumber, pad)}`;
    return orderNum;
};

module.exports = {
    generateOrderNum,
};
