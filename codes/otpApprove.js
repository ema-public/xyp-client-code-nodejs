const XypClientCode = require("./xypClientCode");
const sign = require("./xypSign");
const soap = require('soap');
const prompt = require('prompt-sync')();

let time = Math.floor(+new Date() / 1000);
let url = 'https://xyp.gov.mn/meta-1.5.0/ws?WSDL';
const data = new sign(process.env.XYP_KEY, process.env.XYP_TOKEN, time);
const signData = data.sign();

/**
 * OTP код авах WS100008_registerOTPRequest сервисийг ашиглаж WS100101_getCitizenIDCardInfo сервисийг ашиглах хүсэлтийг sms-ээр явуулах
 *
 * @author buyndelger
 * @since 2023-05-17
 */

const args = {
    'request': {
        'regnum': process.env.REGNUM, 'jsonWSList': JSON.stringify([{
            ws: 'WS100101_getCitizenIDCardInfo'
        }]), 'isSms': 1, 'isApp': 0, 'isEmail': 0, 'isKiosk': 0, 'phoneNum': 0
    },
};

soap.createClient(url, {endpoint: url}, function (err, client) {
    client.addHttpHeader('accessToken', signData.accessToken);
    client.addHttpHeader('timeStamp', signData.timeStamp.toString());
    client.addHttpHeader('signature', signData.signature);

    client.WS100008_registerOTPRequest(args, function (err, result) {
        console.log(err);
        console.log(result);
        console.log(result.return.resultCode);
        let resultCode = result.return.resultCode;
        callOTP(resultCode);
    });
});

/**
 * OTP авах амжилттай болсон тохиолдолд иргэнд ирсэн кодыг ашиглаж сервис дуудах
 * @param resultCode WS100008_registerOTPRequest сервис амжилттай дуудагдсан эсэх
 *
 * @author buyndelger
 * @since 2023-05-17
 */
function callOTP(resultCode) {
    if (resultCode === 0) {
        const otp = prompt("OTP код оруулна уу: ");
        console.log('You are ${otp} years old.');
        let xypClientCode = new XypClientCode();
        xypClientCode.XypClientOTP(otp, time, signData);

    } else console.log('OTP үүсгэх амжилтгүй боллоо.');
}

   