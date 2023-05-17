require('dotenv').config();

const WebSocket = require('ws');
const ws = new WebSocket('ws://127.0.0.1:59001');
const { Buffer } = require('buffer');
const {X509Certificate} = require('crypto');
const test = require("./xypClientCode");
let serialNumber ='';
let  signature ='';
//#region Methods

ws.on('open', () => {
    onOpen(ws);
});

ws.on('error', onError);

ws.on('close', onClose);

//#endregion

//#region Functions

let time = Math.floor(+new Date() / 1000);

async function onOpen() {
    async function run() {
        const dataSign = process.env.REGNUM + '.' + time;
        const x = JSON.stringify({ type: 'e457cb50ed64bde0', data: dataSign });
        
        setTimeout( () => {
            ws.send(x);
             setTimeout(() => {
                var result = ws.on('message', onMessage);
                ws.close();
                return result;
            }, 1000);
        }, 1000);
    }
    await run();
}

function parseCertificate(certBase64) {
    const certBuffer = Buffer.from(certBase64, 'base64');
    const cert = new X509Certificate(certBuffer);
    return cert;
}

function getSerialNumber(certBase64) {
    const cert = parseCertificate(certBase64);
    const serialNumberBuffer = cert.serialNumber;
    const serialNumberHex = serialNumberBuffer.toString('hex');
    return serialNumberHex;
}

function onMessage(message) {
    console.log(message);
    const sign = JSON.parse(message);
    serialNumber = getSerialNumber(sign['certificate']);
    signature = sign['signature'];
}

function onError(error) {
    console.error(error);
}

function onClose() {
    if(serialNumber != '' || signature != ''){
        let kk = new test();
        kk.XypClientSignature(signature, serialNumber, time);
    }
    console.log('WebSocket closed');
}
//#endregion


