import { google } from 'googleapis';
import { googleAuth } from './auth';
import dayjs from 'dayjs';
import ics from 'ics';

/**
 * create ics
 * 
 */

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
                timeZone: data.tz
            },
            end: {
                dateTime: data.toDateTime,
                timeZone: data.tz
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
        return true;
    } catch (error) {
        console.log('ERROR in addEvent: ' + error)
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
                console.log(`Existing event found!: ${e.summary}`);
                result = true;
            } else {
                console.log(`Different event found: ${e.summary}`);
            }
        })
        return result;
    } catch (error) {
        console.log('ERROR in testEvent: ' + error)
    }
};

const createIcs = (data) => {
    const start = dayjs(data.fromDateTime).format('YYYY-M-D-H-m').split('-').map(i => parseInt(i));
    const end = dayjs(data.fromDateTime).format('YYYY-M-D-H-m').split('-').map(i => parseInt(i));
    const event = {
        start,
        end,
        title: data.title,
        productId: "Squash Calendar Event",
        busyStatus: "BUSY",
    }
    let icsString;
    ics.createEvent(event, (err, res) => {
        if (err) {
            console.log(`ERROR in ICS CREATE: ${JSON.stringify(err, null, 2)}`)
        }
        console.log(`ICS STRING: ${res}`);
        icsString = res;
    });
    return icsString;
};

module.exports = {
    addEvent,
    testEvent,
    createIcs,
};
