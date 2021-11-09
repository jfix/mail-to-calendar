import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/fr';
dayjs.extend(customParseFormat);

const parseString = (s) => {
    try {
        // should match: Lun.  8 novembre 2021 de 18:00 à 18:45
        const re = /\.\s+(\d+ [a-z]+ \d{4}) de (\d+:\d+) à (\d+:\d+)/
        const m = s.match(re);
        // [".  8 novembre 2021 de 18:00 à 18:45", "8 novembre 2021", "18:00", "18:45"] (4) 
        if (!m) throw new Error('Wrong syntax, please use "Name" on "Date"');

        const date = m[1] // 8 novembre 2021
        const from = m[2] // 18:00
        const to = m[3]   // 18:45

        // parse provided string date into dayjs if possible
        const parsedDate = dayjs(`${date}`, ['D MMMM YYYY', 'D MMM YYYY'], 'fr', true)
        if (!parsedDate.isValid()) throw new Error('Date is not valid');

        // return object with date, start and end time
        return { 
            date: parsedDate, from, to
        }
    } catch(e) {
        console.log(`Error in parseString: ${e}`)
        throw e;
    }
};

module.exports = {
    parseString
};