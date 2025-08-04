import nodeMailer from 'nodemailer'

export const sendMail = async (subject, receiver, body) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD
        }
    });

    const options = {
        from: `"Piyush Malviya" <${process.env.NODEMAILER_EMAIL}>`,
        to: receiver,
        subject: subject,
        html: body
    }
    try {
        await transporter.sendMail(options);
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}
