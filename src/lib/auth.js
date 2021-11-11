import { JWT } from 'google-auth-library';

let jwt;

module.exports.googleAuth = () => {
    try {
        jwt = new JWT({
            email: process.env.GOOGLE_APPLICATION_CREDENTIALS_EMAIL,
            key: process.env.GOOGLE_APPLICATION_CREDENTIALS_KEY.replace(/\\n/gm, '\n'),
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });
        return jwt;
    } catch (error) {
        console.log(`AUTH: ${error}`)
    }
};