require('dotenv').config();

const WebSocket = require('ws');
const ws = new WebSocket('ws://127.0.0.1:59001');
const {Buffer} = require('buffer');
const {X509Certificate} = require('crypto');
const XypClientCode = require("./xypClientCode");
let serialNumber = '';
let signature = '';
let time = Math.floor(+new Date() / 1000);

ws.on('open', () => {
    onOpen(ws);
});
ws.on('error', onError);
ws.on('close', onClose);

/**
 * esign client программыг ашиглаж regnum.timestamp мэдээллийг тоон гарын үсгээр баталгаажуулах хүсэлт явуулах
 */
function onOpen() {
    function run() {
        const dataSign = process.env.REGNUM + '.' + time;
        const x = JSON.stringify({type: 'e457cb50ed64bde0', data: dataSign});

        setTimeout(() => {
            ws.send(x);
            setTimeout(() => {
                var result = ws.on('message', onMessage);
                ws.close();
                return result;
            }, 1000);
        }, 1000);
    }

    run();
}

/**
 * esign client программаас мэдээлэл хүлээж авах
 * @param message esign client программаас ирж буй мэдээлэл
 */
function onMessage(message) {
    const sign = JSON.parse(message);
    serialNumber = getSerialNumber(sign['certificate']);
    signature = sign['signature'];
}

/**
 * esign client программтай холболт дууссан үед өгөгдсөн мэдээллээр ХУР-ын сервис дуудах
 */
function onClose() {
    if (serialNumber !== '' || signature !== '') {
        let xypClientCode = new XypClientCode();
        xypClientCode.XypClientSignature(signature, serialNumber, time);
    }
    console.log('WebSocket closed');
}

/**
 * string мэдээллийг X509Certificate болгож хөрвүүлэх
 * @param certBase64 сертификатын мэдээлэл
 * @returns {module:crypto.X509Certificate}
 */
function parseCertificate(certBase64) {
    const certBuffer = Buffer.from(certBase64, 'base64');
    return new X509Certificate(certBuffer);
}

/**
 * сертификатын мэдээллээс сериал дугаарыг олж авах
 * @param certBase64
 * @returns {string}
 */
function getSerialNumber(certBase64) {
    const cert = parseCertificate(certBase64);
    const serialNumberBuffer = cert.serialNumber;
    return serialNumberBuffer.toString('hex');
}

function onError(error) {
    console.error(error);
}



