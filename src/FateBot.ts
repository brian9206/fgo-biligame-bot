import { FateClient } from './fate-biligame-client';
import { randomNumber } from './Random';

export class FateBot {
    private client: FateClient;

    constructor(client: FateClient) {
        this.client = client;
    }

    public async run(user: FateUser): Promise<any> {
        try {
            // Login
            let loginToMemberCenterResponse: LoginToMemberCenterResponse = await this.client.loginToMemberCenter(user);
            let loginResponse: LoginResponse = await this.client.login(loginToMemberCenterResponse);
            let topLoginResponse: TopLoginResponse = await this.client.topLogin(loginResponse);

            // Get presents
            let presents: UserPresentBoxItem[] = await this.client.getPresentList();
            let presentIds: number[] = [];

            if (presents.length > 0 && presents[0].hasOwnProperty("presentId")) {
                // get a list of present id
                for (let present of presents) {
                    presentIds.push(parseInt(present.presentId));
                }

                // receive present
                await this.client.receivePresent(presentIds);
            }

            // Display message
            let userLogin: UserLogin = this.client.getCache<UserLogin[]>("userLogin")[0];
            let tblUserGame: TblUserGame = this.client.getCache<TblUserGame[]>("tblUserGame")[0];
            let userGame: UserGame = this.client.getCache<UserGame[]>("userGame")[0];

            console.log("--------------------\n" +
                "Account: " + user.username + "\n" +
                "Last login: " + new Date(userLogin.lastLoginAt * 1000).toString() + "\n" +
                "Continuous login: " + userLogin.seqLoginCount + " day(s)\n" +
                "Total login: " + userLogin.totalLoginCount + " day(s)\n" +
                "QP: " + userGame.qp + "\n" +
                "Stone: Free(" + userGame.freeStone + "), Charged(" + userGame.chargeStone + ")\n" +
                "Friend Point: " + tblUserGame.friendPoint + "\n" +
                "Present received: " + presentIds.length + "\n" +
                "--------------------"
                );
        }
        catch (e) {
            return e;
        }

        // return null if no error
        return null;
    }
}