const crypto = require('crypto');
const xypSign = crypto.createSign('SHA256');
const fs = require('fs')

class Sign{
    constructor(keyPath, accessToken, time){
        this.KeyPath = keyPath;
        this.AccessToken = accessToken;
        this.Timestamp = time;
    }

    sign(){
        var signData = this.AccessToken + "." + this.Timestamp;
        xypSign.write(signData);
        xypSign.end();

        const key = fs.readFileSync(this.KeyPath);
        var signature_b64 = xypSign.sign(key, 'base64');
        
        return {
            accessToken: this.AccessToken,
            timeStamp: this.Timestamp,
            signature: signature_b64
        };
    }
    
}
module.exports = Sign;