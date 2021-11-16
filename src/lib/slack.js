import { WebClient, LogLevel } from '@slack/web-api';

const client = new WebClient(process.env.SLACK_USER_TOKEN, {
    logLevel: LogLevel.ERROR
});

const uploadSlackFile = async (fileContent, title, channelId) => {
    try {
        // Call the files.upload method using the WebClient
        await client.files.upload({
            channels: channelId,
            initial_comment: "Put this event in your calendar! :calendar:",
            content: fileContent,
            filetype: 'ics',
            filename: `${title}.ics`,
            title,
        });
        console.log(`✔ Slack message sent!`);
    } catch (error) {
        console.error(`𐄂 Error sending message to Slack: ${error}`);
    }
};

module.exports = {
    uploadSlackFile
};
