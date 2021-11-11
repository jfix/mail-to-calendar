import { parseString } from './lib/utils';
import { extractMail } from './lib/mail';
import { createIcs } from './lib/calendar';
// import { addEvent, testEvent, createIcs } from './lib/calendar';

export async function handler(event) {
  console.log(`${new Date}`);
  const message = await extractMail(event);
  const dateTime = parseString(message);
  // console.log(`Date time: ${JSON.stringify(dateTime, null, 2)}`);

  const eventData = {
    ...dateTime,
    title: "Squash at St Cloud"
  }
  const ics = createIcs(eventData);
  console.log(`ICS: ${ics}`);

  // const eventExists = await testEvent(eventData);
  // if (!eventExists) {
  //   const res = await addEvent(eventData);
  //   console.log(`Event creation: ${JSON.stringify(res)}`);
  // } else {
  //   console.log(`Event already exists, not recreating.`)
  // }
}
