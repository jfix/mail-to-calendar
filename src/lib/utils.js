import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/fr';
dayjs.extend(customParseFormat);

const parseString = (s) => {
    try {
        // should match: Lun.  8 novembre 2021 de 18:00 à 18:45
        const re = /\.\s+(\d+\s+[\p{L}]+ \d{4}) de (\d+:\d+) à (\d+:\d+)/u
        const m = s.match(re);
        // [".  8 novembre 2021 de 18:00 à 18:45", "8 novembre 2021", "18:00", "18:45"] (4) 
        if (!m) throw new Error(`Couldn't extract date from provided string.`);

        const date = m[1] // 8 novembre 2021
        const fromTime= m[2] // 18:00
        const toTime = m[3]   // 18:45

        // parse provided string date into dayjs if possible
        const parsedDate = dayjs(`${date}`, ['D MMMM YYYY', 'D MMM YYYY'], 'fr', true);
        if (!parsedDate.isValid()) throw new Error('Date is not valid');
        
        const formattedDate = parsedDate.format('YYYY-MM-DD');
        console.log(`✔️ Extracted date and time from string.`)
        // return object with date, start and end time
        return { 
            date: parsedDate, 
            fromDateTime: dayjs(`${formattedDate} ${fromTime}`).format(),
            toDateTime: dayjs(`${formattedDate} ${toTime}`).format(),
            tz: "Europe/Paris"
        }
    } catch(e) {
        console.error(`𐄂 Error in parseString: ${e}`);
        throw e;
    }
};

module.exports = {
    parseString
};
