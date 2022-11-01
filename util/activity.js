require('dotenv').config();
const { TIME_ZONE_DIFF, TOTAL_TIME } = process.env;
if (TIME_ZONE_DIFF === undefined || TOTAL_TIME === undefined) {
    console.warn('No env');
}
const { DateTime } = require('luxon');
const YEAR = Number(process.argv[2]);
const MONTH = Number(process.argv[3]);
const DATE = Number(process.argv[4]);
const HOUR = Number(process.argv[5]);
const MINUTE = Number(process.argv[6]);
const timeZoneDiff = Number(TIME_ZONE_DIFF);
const totalTime = Number(TOTAL_TIME);
class Activity {
    constructor() {
        this.year = YEAR;
        this.month = MONTH;
        this.date = DATE;
        this.hour = HOUR;
        this.minute = MINUTE;
        this.timeZoneDiff = timeZoneDiff;
        this.startTime = DateTime.local(this.year, this.month, this.date, this.hour - this.timeZoneDiff, this.minute).setZone('Asia/Taipei');
        this.endTime = DateTime.local(this.year, this.month, this.date, this.hour - this.timeZoneDiff, this.minute)
            .plus({ minutes: totalTime })
            .setZone('Asia/Taipei');
        console.log(this.startTime);
        console.log(this.endTime);
    }
    isStart() {
        const now = DateTime.now().setZone('Asia/Taipei');
        return now > this.startTime;
    }
    isEnd() {
        const now = DateTime.now().setZone('Asia/Taipei');
        return now > this.endTime;
    }
    isDuring() {
        const now = DateTime.now().setZone('Asia/Taipei');
        if (now > this.startTime && now < this.endTime) {
            return true;
        } else {
            return false;
        }
    }
}
module.exports = Activity;
