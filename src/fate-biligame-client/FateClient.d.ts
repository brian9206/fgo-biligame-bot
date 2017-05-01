interface FateUser {
    username: string;
    uid: string;
    accessToken: string;
}

interface LoginToMemberCenterResponse {
    rguid: string;
    rgusk: string;
    rgtype: number;
    version: string;
    dateVer: number;
    dataVer: number;
}

interface LoginResponse {
    sguid: string;
    level: string;
    createTime: string;
    nickname: string;
    sgusk: string;
    sgtype: number,
    sgtag: number,
    type: string;
    platformManagement: string;
    announcement: any[];
}

interface TopLoginResponse {
    addFriendPoint: number;
    topAddFriendPointClass: number;
}

interface UserPresentBoxItem {
    receiveUserId: string;
    presentId: string;
    isAuto: boolean;
    messageRefType: string;
    messageId: string;
    message: string,
    args: string;
    fromType: string;
    giftType: string;
    objectId: string;
    num: string;
    limitCount: string;
    lv: string;
    status: string;
    updatedAt: string;
    createdAt: string;
}

interface ReceivePresentResponse {
    isOverflow: boolean;
    getSvts: any[];
}

// Cache struct
interface UserLogin {
    userId: string,
    seqLoginCount: string;
    totalLoginCount: string;
    lastLoginAt: number;
    createdAt: string;
}

interface UserGame {
    lv: string;
    exp: string;
    qp: string;
    friendCode: string;
    freeStone: string;
    chargeStone: string;
}

interface TblUserGame {
    friendPoint: number;
}