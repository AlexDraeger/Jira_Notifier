import JiraApi from 'jira-client';
import notifier from 'node-notifier';
import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';

import * as dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var jira = new JiraApi({
    protocol: 'https',
    host: process.env.HOST,
    username: process.env.USERNAME,
    password: process.env.API_KEY,
    apiVersion: '3',
    strictSSL: true
  });

async function main(){
    const user = await jira.searchJira('assignee=currentuser() AND created > "2023/02/01"');
    user.issues.forEach((element) => {
       notifier.notify({
            title: `New JIRA Ticket ${element.key}`,
            icon: path.join(__dirname, 'logos/jira_logo.svg'),
            message: `Summary: ${element.fields.summary}\nCreator: ${element.fields.creator.displayName}`,
            sound: true,
            wait:true,
            open: open(`https://${process.env.HOST}/browse/${element.key}`,{app: 'firefox'})
          })
    })
    return 0;
}
main();
