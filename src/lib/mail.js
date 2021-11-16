import { simpleParser } from 'mailparser';
import nodemailer from 'nodemailer';
import aws from '@aws-sdk/client-ses';

/**
 * Extract the plain text from an email message.
 * @param {Object} event 
 * @returns string containing the plain text contents.
 */
const extractMail = async (event) => {
    try {
        const sesNotification = event.Records[0].Sns;
        const rawMessageObject = JSON.parse(sesNotification.Message);
        const encodedContentObject = rawMessageObject.content;
        const decodedContentObject = Buffer.from(encodedContentObject, 'base64');
        const parsedMessage = await simpleParser(decodedContentObject);

        if (!parsedMessage) throw new Error("simpleParser could not parse message");
        console.log(`✔️ Successfully extracted email message.`);
        return parsedMessage.text;
    } catch(e) {
        console.error(`𐄂 Error while attempting to extract email message: ${e}`)
        throw e;
    }
}

const sendMail = async (data) => {
    try {
        const ses = new aws.SES({
            apiVersion: "2010-12-01",
            region: "us-east-1",
        });
        let transporter = nodemailer.createTransport({
            SES: { ses, aws },
        });
        const message = {
            from: 'squash@jfix.link',
            to: data.to,
            subject: data.title,
            text: data.body,
            icalEvent: {
                filename: `${data.title}.ics`,
                method: 'request',
                content: data.attachment
            }
        };
        await transporter.sendMail(message);
        console.log(`✔️ Email message successfully sent to ${data.to.join(', ')}.`);
    } catch (err) {
        console.error(`𐄂 Error sending email: ${err}`);
    }
};

module.exports = {
    extractMail,
    sendMail
};
