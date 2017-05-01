import * as fs from 'fs';
import { FateClient, FateClientInfo } from './fate-biligame-client';
import { FateBot } from './FateBot';
import { randomNumber } from './Random';

async function bootstrap() {
    // Get user list
    let users: FateUser[] = JSON.parse(fs.readFileSync(process.cwd() + "/users.json", "UTF-8"));

    if (users.length === 0) {
        console.log("> No user is specified.");
        return;
    }

    // Get server list
    console.log("> Fetching network configuration...");

    let clientInfo = new FateClientInfo("clientinfo.json");

    let _client = new FateClient(clientInfo);
    let serverList: string[] = await _client.getServerList();

    if (serverList.length === 0) {
        console.log("> No server is available.");
        return;
    }

    console.log("> Running " + users.length + " bots...");
    
    // start bots
    let tasks: Promise<any>[] = [];

    for (let user of users) {
        tasks.push(new FateBot(new FateClient(clientInfo, serverList[randomNumber(0, serverList.length - 1)])).run(user));
    }

    let errors: any[] = await Promise.all(tasks);

    // display result
    console.log("> Error encountered:");

    for (let error of errors) {
        if (error != null) {
            console.log(JSON.stringify(error, null, 4));
        }
    }

    process.exit(0);
}

console.log("Fate/GO (Biligame, Android) Login BOT");
console.log("written By Brian\n");

bootstrap();