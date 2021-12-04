import { parseString } from './lib/utils';
import { extractMail } from './lib/mail';
import { addEvent, testEvent, createIcs } from './lib/calendar';
import { uploadSlackFile } from './lib/slack';
import { sendMail } from './lib/mail';

export async function handler(event) {
  try {
    // show we are alive, for debugging
    console.log(`${new Date}`);
    // get email message from SNS topic event
    const message = await extractMail(event);
    // attempt to find date and from/to times
    const dateTime = parseString(message);
    // prepare some data we need
    const title = `Squash at St Cloud <<3 (v${process.env.SCRIPT_VERSION})`;
    const eventData = {
      ...dateTime,
      title
    };
    console.log(`  Times extracted: ${eventData.fromDateTime}-${eventData.toDateTime}`);
    // test in calendar for existing event, otherwise add it
    const eventExists = await testEvent(eventData);
    if (!eventExists) {
      await addEvent(eventData);
    } else {
      console.log(`  Event already exists, not recreating.`);
    }
    // creae ICS event string
    const ics = createIcs(eventData);
    // upload ICS string as file to Slack
    await uploadSlackFile(ics, title, process.env.SLACK_CHANNEL);
    // prepare email data and send email
    const emailData = {
      to: process.env.EMAIL_RECIPIENTS.split(','),
      title,
      body: 'See attachment',
      attachment: ics,
    }
    await sendMail(emailData);
  } catch(err) {
    console.log(`𐄂 Error in Lambda function: ${err.message}`)
  }
}
