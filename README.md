# README

## Installation
### Create a .env-File with these Variables
```env
HOST="yourcompany.atlassian.net"
USERNAME="your email"
API_KEY="your api token - check jira doc"
```
Then run
```bash
npm install
```

## Copy Service to systemd
```
mv path/to/jira_notifier.service /etc/systemd/system/
```


## Enable Service
```bash
cd /etc/systemd/system &&
systemctl enable jira_notifier.service &&
systemctl start jira_notifier.service &&
systemctl status jira_notifier.service
```
Now you should get notificaitons


## Troubleshooting
### Check Permissions in jira.notifier.service File
### also check your dbus interface by running
```bash
echo $DBUS_SESSION_BUS_ADDRESS
```
### example output:
unix:path=/run/user/1000/bus
