import { simpleParser } from 'mailparser';

const extractMail = async (event) => {
    try {
        const sesNotification = event.Records[0].Sns;
        // console.log("SES Notification:\n", JSON.stringify(sesNotification, null, 2));
        const rawMessageObject = JSON.parse(sesNotification.Message)
        const encodedContentObject = rawMessageObject.content
        // console.log(`JSON message: ${encodedContentObject}`)
      
        var decodedContentObject = Buffer.from(encodedContentObject, 'base64')
        // console.log(`Decoded content: ${decodedContentObject}`)
        
        const parsedMessage = await simpleParser(decodedContentObject)
        if (!parsedMessage) throw new Error("simpleParser could not parse message")
        // console.log(`PARSED TEXT: ${JSON.stringify(parsedMessage, null, 2)}`)
        return parsedMessage.text;
    } catch(e) {
        console.log(`Error in extractMessage: ${e}`)
        throw e;
    }
}

module.exports = {
    extractMail
};
