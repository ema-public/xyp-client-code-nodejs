# xyp-client-code-nodejs
Төрийн мэдээлэл солилцооны ХУР системийн хэрэглэгчийн жишээ кодыг Nodejs хэл дээр бэлтгэв.

## Шаардлага 
    node version v18.16.0
    npm version 9.5.1

[.env](./.env) файлд шаардлагатай мэдээллийг бөглөх. Үүнд:
```bash
#ҮДТ - өөс олгогдсон accessToken мэдээлэл
XYP_TOKEN = "1d2f1d2fs3d2f1s35sf3sd1f2sd"
#ҮДТ өөс олгогдсон openVPN key-ийн мэдээллийг агуулж буй файлын зам.
XYP_KEY = "key.key"
#Иргэний регистрийн дугаар
REGNUM = "АА00112233"
#Тоон гарын үсэг зурах client программын  local дээр ажиллаж буй хаяг. 
#ESIGN CLIENT программын хувьд тогтмол "127.0.0.1:97001" байна.
SIGNATURE_HOST = "127.0.0.1:97001"
#Тогтмол 0 утга авна.
NODE_TLS_REJECT_UNAUTHORIZED  = 0
```
[key.key](./key.key) файлд ҮДТ өөс олгогдсон openVPN key-ийн мэдээллийг хуулна.

ESIGN клиент програм (Win 7, 8, 10 64 бит) [татах](https://ra.datacenter.gov.mn/software/installer).
## Сервис дуудах
Иргэнийг тоон гарын үсгээр баталгаажуулан дуудахдаа [digitalSignatureApprove.js](./codes/digitalSignatureApprove.js) кодыг ажиллуулна.
```bash
node ./codes/digitalSignatureApprove.js
```
Иргэнийг OTP кодоор баталгаажуулан дуудахдаа [otpApprove.js](./codes/otpApprove.js) кодыг ажиллуулна.
```bash
node ./codes/otpApprove.js
``` 
