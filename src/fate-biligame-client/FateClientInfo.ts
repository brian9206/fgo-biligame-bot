import * as fs from 'fs';
import * as process from 'process';

export class FateClientInfo {
    // Version
    appVersion: string;
    version: number;
    dateVersion: number;
    dataVersion: number;

    // Http headers
    userAgent: string;
    unityVersion: string;

    // unknown fields
    v: string;
    s: number;
    developmentAuthCode: string;
    rksdkid: number;
    rkchannel: number;

    // Device info
    os: string;
    deviceType: string;
    deviceId: string;
    mac: string;
    imei: string;

    constructor(filename: string) {
        let data = JSON.parse(fs.readFileSync(process.cwd() + "/" + filename, "UTF-8"));

        for (let key in data) {
            this[key] = data[key];
        }
    }
}