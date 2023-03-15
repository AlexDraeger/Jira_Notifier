// to implement windows notifications check
// https://stackoverflow.com/questions/39535937/what-is-the-notify-send-equivalent-for-windows

import JiraApi from 'jira-client';
import notifier from 'node-notifier';
import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';

import * as dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let datum = new Date()
datum.setDate(datum.getDate() - 7)
const stringDate = `${datum.getFullYear()}/${datum.getMonth()+1}/${datum.getDate()}`

var jira = new JiraApi({
    protocol: 'https',
    host: process.env.HOST,
    username: process.env.USERNAME,
    password: process.env.API_KEY,
    apiVersion: '3',
    strictSSL: true
  });

async function main(){
    const user = await jira.searchJira(`assignee=currentuser() AND created > "${stringDate}"`);
    if(user.total == 0) {
      console.log('There are no new tickets')
      notifier.notify({
        title: 'No new Tickets',
        icon: path.join(__dirname, 'logos/jira_logo.svg'),
        message: `weitermache`,
        sound: true,
      })
      return 0;
    }
    user.issues.forEach((element) => {
      console.log('There are new tickets') 
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
