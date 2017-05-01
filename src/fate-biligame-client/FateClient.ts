/// <reference path="./FateClient.d.ts" />

import * as crypto from 'crypto';
import * as request from 'request-promise-native';
import { FateClientInfo } from './FateClientInfo';
import { randomNumber } from '../Random';

// Decrypted Funny Key
const DECRYPTED_FUNNY_KEY: string = "B6949765EC73CF001718B5FD507FCD9E";

export class FateClient {
    private info: FateClientInfo;
    private server: string;
    private cache: any;

    private uid: string;
    private usk: string;
    private dateVer: number;

    constructor(clientInfo: FateClientInfo, server: string = "https://line1.s1.bili.fate.biligame.net") {
        this.info = clientInfo;
        this.server = server;
        this.resetCache();
    }

    private calcUsk(usk: string = this.usk): string {
        let md5 = crypto.createHash("md5");
        md5.update(DECRYPTED_FUNNY_KEY + usk);
        return md5.digest("hex");
    }

    private async getRequest(url: string, param: any): Promise<any> {
        let options: request.Options = {
            url: this.server + url,
            method: "GET",
            qs: param,
            headers: {
                "User-Agent": this.info.userAgent,
                "X-Unity-Version": this.info.unityVersion
            }
        }

        return JSON.parse(
            await request(options)
        );
    }

    private async postRequest(url: string, param: any): Promise<any> {
        let options: request.Options = {
            url: this.server + url,
            method: "POST",
            form: param,
            headers: {
                "User-Agent": this.info.userAgent,
                "X-Unity-Version": this.info.unityVersion
            }
        }

        return JSON.parse(
            new Buffer(
                decodeURIComponent(
                    await request(options)
                )
            , "base64").toString("utf8")
        );
    }

    private async acRequest(_key: string, param: any = {}): Promise<any> {
        let params = {
            ac: "action",
            key: _key,
            deviceid: this.info.deviceId,
            os: this.info.os,
            ptype: this.info.deviceType,
            usk: this.calcUsk(this.usk),
            umk: "",
            rgsid: 1001,
            rkchannel: this.info.rkchannel,
            userId: this.uid,
            appVer: this.info.appVersion,
            dateVer: this.dateVer,
            lastAccessTime: Math.ceil(new Date().getTime() / 1000),
            try: "",
            developmentAuthCode: this.info.developmentAuthCode,
            userAgent: 1,
            dataVer: this.info.dataVersion
        };

        // override params
        for (let key in param) {
            params[key] = param[key];
        }

        let data = await this.postRequest("/rongame_beta/rgfate/60_1001/ac.php?_userId=" + encodeURIComponent(this.uid), params);

        if (data.response[0].resCode !== "00") {
            throw data;
        }

        // save last usk
        this.usk = data.response[0].usk;

        // update cache
        for (let key in data.cache.updated) {
            this.cache[key] = data.cache.updated[key];
        }

        for (let key in data.cache.replaced) {
            this.cache[key] = data.cache.replaced[key];
        }

        return data;
    }

    public getCache<T>(key: string): T {
        return this.cache[key];
    }

    public resetCache() {
        this.cache = {};
    }

    /**
     * Get server list
     */
    public async getServerList(): Promise<string[]> {
        let response = await this.getRequest("/rongame_beta/rgfate/60_member/network/network_config_android_" + this.info.appVersion + ".json", { 
            t: Math.ceil(new Date().getTime() / 1000) 
        });

        return response.list[randomNumber(0, response.list.length - 1)].ser;
    }

    public async loginToMemberCenter(user: FateUser): Promise<LoginToMemberCenterResponse> {
        let data = await this.postRequest("/rongame_beta/rgfate/60_member/logintomembercenter.php", {
            deviceid: this.info.deviceId,
            t: 22360,
            v: this.info.v,
            s: this.info.s,
            mac: this.info.mac,
            os: this.info.os,
            ptype: this.info.deviceType,
            imei: this.info.imei,
            username: user.username,
            type: "token",
            rkuid: user.uid,
            access_token: user.accessToken,
            rksdkid: this.info.rksdkid,
            rkchannel: this.info.rkchannel,
            appVer: this.info.appVersion,
            dateVer: this.info.dateVersion,
            lastAccessTime: Math.ceil(new Date().getTime() / 1000),
            try: "",
            developmentAuthCode: this.info.developmentAuthCode,
            version: this.info.version,
            dataVer: this.info.dataVersion
        });

        if (data.response[0].resCode !== "00") {
            throw data;
        }

        let response: LoginToMemberCenterResponse = data.response[0].success;
        this.dateVer = response.dateVer;

        return response;
    }

    public async login(request: LoginToMemberCenterResponse): Promise<LoginResponse> {
        let data = await this.postRequest("/rongame_beta/rgfate/60_1001/login.php", {
            deviceid: this.info.deviceId,
            os: this.info.os,
            ptype: this.info.deviceType,
            rgsid: 1001,
            rguid: request.rguid,
            rgusk: request.rgusk,
            ida: "",
            v: this.info.v,
            mac: "0",
            imei: "",
            type: "login",
            nickname: request.rgusk.substring(0, 10),
            rkchannel: this.info.rkchannel,
            assetbundleFolder: "",
            appVer: this.info.appVersion,
            dateVer: this.info.dateVersion,
            lastAccessTime: Math.ceil(new Date().getTime() / 1000),
            try: "",
            developmentAuthCode: this.info.developmentAuthCode,
            userAgent: 1,
            t: 20399,
            s: this.info.s,
            rksdkid: this.info.rksdkid,
            dataVer: this.info.dataVersion
        });

        if (data.response[0].resCode !== "00") {
            throw data;
        }

        let response: LoginResponse = data.response[0].success;
        this.uid = response.sguid;
        this.usk = response.sgusk;

        return response;
    }

    public async topLogin(request: LoginResponse): Promise<TopLoginResponse> {
        this.resetCache();

        let data = await this.acRequest("toplogin", {
            "nickname": request.nickname,
            "sgtype": request.sgtype,
            "sgtag": request.sgtag
        });

        return data.response[0].success;
    }

    public async getPresentList(): Promise<UserPresentBoxItem[]> {
        await this.acRequest("presentlist");
        return this.getCache<UserPresentBoxItem[]>("userPresentBox");
    }

    public async receivePresent(presentIds: number[]): Promise<ReceivePresentResponse> {
        let data = await this.acRequest("presentreceive", {
            a: presentIds[0],
            presentIds: JSON.stringify(presentIds)
        });

        return data.response[0].success;
    }


}