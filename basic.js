// windows notification:
// https://stackoverflow.com/questions/39535937/what-is-the-notify-send-equivalent-for-windows

import JiraApi from "jira-client";
import notifier from "node-notifier";
import open from "open";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const jira = new JiraApi({
  protocol: "https",
  host: process.env.HOST,
  username: process.env.USERNAME,
  password: process.env.API_KEY,
  apiVersion: "3",
  strictSSL: true,
});

async function main() {
  const { issues } = await jira.searchJira(
    `assignee=currentuser() AND created > "${await setDate()}"`
  );
  if (issues?.length === 0) {
    notifier.notify({
      title: `JIRA Notificator`,
      icon: path.join(__dirname, "jira_logo.svg"),
      message: `There are no new JIRA Tickets`,
      sound: true,
      wait: true,
    });
  }
  else {
    issues.forEach((item, index) => {
      notifier.notify({
        title: `New JIRA Ticket ${item.key}`,
        icon: path.join(__dirname, "jira_logo.svg"),
        message: `Summary: ${item.fields.summary}\nCreator: ${item.fields.creator.displayName}`,
        sound: true,
        wait: true,
        open: open(`https://${process.env.HOST}/browse/${item.key}`, {
          app: "firefox",
        }),
      });
    });
  }
  return 0;
}

async function setDate() {
  let date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0].replace(/-/g, "/");
}

main();

