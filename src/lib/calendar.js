import { google } from 'googleapis';
import { googleAuth } from './auth';
import dayjs from 'dayjs';
import ics from 'ics';

/**
 * Create an event based on the data object in the calendar.
 * 
 * @param {Object} data containing startTimeDate, endTimeDate and event title
 * date must use this format: 2021-12-31 
 * @returns boolean
 */
 const addEvent = async (data) => {
    try {
        const event = {
            summary: data.title,
            start: {
                dateTime: data.fromDateTime,
            },
            end: {
                dateTime: data.toDateTime,
            }
        };
        const calendar = google.calendar({
            version: 'v3', 
            auth: googleAuth()
        });
        await calendar.events.insert({
            calendarId: process.env.CALENDAR_ID,
            requestBody: event
        });
        console.log(`✔️ Event successfully added to Google calendar.`);
        return true;
    } catch (error) {
        console.error(`𐄂 Error adding event to Google calendar: ${error}`);
        return false;
    }
};

/**
 * Given a data object with startTimeDate, endTimeDate and a event title
 * return boolean indicating whether there is already such an event in 
 * the calendar.
 * 
 * @param {Object} data 
 * @returns boolean
 */
const testEvent = async (data) => {
    try {
        const calendar = google.calendar({
            version: 'v3',
            auth: googleAuth()
        });
        const { data: { items } } = await calendar.events.list({
            calendarId: process.env.CALENDAR_ID,
            timeMin: dayjs(data.fromDateTime).startOf('d').format(),
            timeMax: dayjs(data.toDateTime).endOf('d').format(),
            maxResults: 100,
        })

        let result = false;
        items.filter((e) => {
            if (e.summary == data.title) {
                console.log(`𐄂 Existing event found!: ${e.summary}`);
                result = true;
            } else {
                console.log(`✔️ Different event found: ${e.summary}`);
            }
        })
        return result;
    } catch (error) {
        console.error(`𐄂 Error testing calendar event: ${error}`);
    }
};

/**
 * Create an ICS compliant string and return it
 * @param {Object} data 
 * @returns String containing an ICS calendar event
 */
const createIcs = (data) => {
    try {
        const start = dayjs(data.fromDateTime).format('YYYY-M-D-H-m').split('-').map(i => parseInt(i));
        const end = dayjs(data.toDateTime).format('YYYY-M-D-H-m').split('-').map(i => parseInt(i));
        const event = {
            start,
            end,
            title: data.title,
            productId: "Squash Calendar Event",
            busyStatus: "BUSY",
            classification: "PRIVATE",
        }
        let icsString;
        ics.createEvent(event, (err, res) => {
            icsString = res;
        });
        return icsString;
    } catch (error) {
        console.error(`𐄂 Error while creating ICS event: ${JSON.stringify(error, null, 2)}`)
    }
};

module.exports = {
    addEvent,
    testEvent,
    createIcs,
};
