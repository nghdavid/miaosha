require('dotenv').config();
const { TIME_ZONE_DIFF, TOTAL_TIME } = process.env;
const Parameter = require('../model/parameter-model');
const { DateTime } = require('luxon');

const timeZoneDiff = Number(TIME_ZONE_DIFF);
const totalTime = Number(TOTAL_TIME);
class Activity {
    constructor() {
        this.timeZoneDiff = timeZoneDiff;
    }
    async setTime() {
        this.year = await Parameter.getYear();
        this.month = await Parameter.getMonth();
        this.date = await Parameter.getDate();
        this.hour = await Parameter.getHour();
        this.minute = await Parameter.getMinute();
        this.second = await Parameter.getSecond();
        this.startTime = DateTime.local(this.year, this.month, this.date, this.hour - this.timeZoneDiff, this.minute, this.second).setZone('Asia/Taipei');
        this.endTime = DateTime.local(this.year, this.month, this.date, this.hour - this.timeZoneDiff, this.minute, this.second)
            .plus({ minutes: totalTime })
            .setZone('Asia/Taipei');
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
