import schedule from "node-schedule";
import { updateCertificationsThatExpired } from "../models/relevantTrainingsModel.js";


const dailyRule = new schedule.RecurrenceRule();
dailyRule.hour = 8;
dailyRule.minute = 0;
dailyRule.tz = "Asia/Singapore";

schedule.scheduleJob(dailyRule, async function () {
    await updateCertificationsThatExpired();
});

// For testing
// const secondRule = new schedule.RecurrenceRule();
// secondRule.second = 0;

// schedule.scheduleJob(secondRule, async function () {
//     await updateCertificationsThatExpired();
// });