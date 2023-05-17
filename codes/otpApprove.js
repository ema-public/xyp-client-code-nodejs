const XypClientCode = require("./xypClientCode");

let time = Math.floor(+new Date() / 1000);
let xypClientCode = new XypClientCode();
xypClientCode.XypClientOTP('123465', time);