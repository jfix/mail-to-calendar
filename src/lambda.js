import { parseString } from './lib/get-date-time';
import { extractMail } from './lib/get-email-message';

export async function handler(event) {
  console.log(`${new Date}`);
  const message = await extractMail(event);
  const dateTime = parseString(message);
  console.log(`Date time: ${JSON.stringify(dateTime, null, 2)}`);
}
