require('dotenv').config();
const sign = require("./xypSign");

process.title = 'node-chat';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
// let data = digitalSignature.digitalSign();
// let signature = data.signature;
// let serialNumber = data.serialNumber;


const crypto = require('crypto');
const soap = require('soap');
const fs = require('fs');

const key = fs.readFileSync(process.env.XYP_KEY);
let url = 'https://xyp.gov.mn/citizen-1.5.0/ws?WSDL';

class XypClientCode {
    constructor(){
    }

    XypClientSignature(signature, serialNumber, time) {
    var data = new sign(process.env.XYP_KEY, process.env.XYP_TOKEN, time);
    var signData = data.sign();

    var args = {
        'request': {
            'regnum': process.env.REGNUM, 
            'auth': {
                'citizen': {
                    'civilId': '',
                    'regnum': process.env.REGNUM,
                    'certFingerprint': serialNumber,
                    'fingerprint': '',  
                    'signature': signature
                },
                'operator': {
                    'regnum': '', 
                    'fingerprint': '', 
        
                }
            }, 
        },
    };
    
    soap.createClient(url, {endpoint : url}, function(err, client) {
        client.addHttpHeader('accessToken', signData.accessToken);
        client.addHttpHeader('timeStamp', signData.timeStamp.toString());
        client.addHttpHeader('signature', signData.signature);
        
        client.WS100101_getCitizenIDCardInfo(args, function(err, result) {
            console.log(err);
            console.log(result);
            console.log(result.return.request.auth.citizen);
        });
    });
    }

    XypClientOTP(otp, time) {
        var data = new sign(process.env.XYP_KEY, process.env.XYP_TOKEN, time);
        var signData = data.sign();
    
        var args = {
            'request': {
                'regnum': process.env.REGNUM, 
                'auth': {
                    'citizen': {
                        'civilId': '',
                        'regnum': process.env.REGNUM,
                        'certFingerprint': '',
                        'fingerprint': '',  
                        'signature': '',
                        'otp':otp
                    },
                    'operator': {
                        'regnum': '', 
                        'fingerprint': '', 
            
                    }
                }, 
            },
        };
        
        soap.createClient(url, {endpoint : url}, function(err, client) {
            client.addHttpHeader('accessToken', signData.accessToken);
            client.addHttpHeader('timeStamp', signData.timeStamp.toString());
            client.addHttpHeader('signature', signData.signature);
            
            client.WS100101_getCitizenIDCardInfo(args, function(err, result) {
                console.log(err);
                console.log(result);
                console.log(result.return.request.auth.citizen);
            });
        });
    }
}
module.exports = XypClientCode;


    


