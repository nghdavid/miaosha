const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  const { user, pass } = process.env;
  // console.log(event.Records[0].messageAttributes);
  const { email, name } = event.Records[0].messageAttributes;
  const to = email.stringValue;
  const userName = name.stringValue;
  const text = `${userName}您好，恭喜您搶購成功！`;
  console.log('email is ', to);
  console.log('name is ', userName);
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user,
      pass,
    },
  });
  let info = await transporter.sendMail({
    from: '"Miaosha" <hydrolab320@gmail.com>', // sender address
    to, // list of receivers
    subject: '秒殺搶購通知', // Subject line
    text, // plain text body
  });
  console.log('Email sent successfully!');
  console.debug('Message sent: %s', info.messageId);
  return `Successfully processed ${event.Records.length} messages.`;
};
