const crypto = require('crypto');
const sign = crypto.createSign('SHA256');
const fs = require('fs')

class Sign{
    constructor(keyPath, accessToken, time){
        this.KeyPath = keyPath;
        this.AccessToken = accessToken;
        this.Timestamp = time;
    }

    sign(){
        var signData = this.AccessToken + "." + this.Timestamp;
        sign.write(signData);
        sign.end();

        const key = fs.readFileSync(this.KeyPath);
        var signature_b64 = sign.sign(key, 'base64');
        
        return {
            accessToken: this.AccessToken,
            timeStamp: this.Timestamp,
            signature: signature_b64
        };
    }
    
}
module.exports = Sign;