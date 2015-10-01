## Requirements

- Node.js >= 4.0.0
  - `sudo apt-get nodejs` on ubuntu
- npm >= 2.14.2
- mySQL 5.6
- Redis

## Deployment

For "deploying" on a-bridge (a-bridge.internal.mcix.us)

If a-bridge is already configured and has production code:

```console
cd /opt/a-bridge
sudo git pull
sudo chown -R www-data:www-data .
sudo npm i
npm restart
```
To make this a little easier, you can write a function in your ~/.profile to take car of this automatically:
```shell
deploy ()
{
  cd /opt/a-bridge
  sudo git pull
  sudo chown -R www-data:www-data .
  sudo npm i
  npm restart
}
```

If starting from scratch:

```console
cd /opt
git clone https://multco.git.beanstalkapp.com/a-bridgeapp.git a-bridge
sudo chown -R www-data:www-data a-bridge/
cd a-bridge/
sudo npm install
sudo npm install -g jshint sequelize-cli gulp
```

We are using upstart to run the node server as a daemon in production. Those commands are used for `npm run {start/stop/restart}`.

The upstart file is in `/etc/init/a-bridge.conf`
```shell
#!upstart
# using upstart http://upstart.ubuntu.com/getting-started.html and node forever  https://github.com/nodejitsu/forever/

description "a-bridge node app"
author      "Multnomah County"

start on runlevel [2345]
stop on runlevel [!2345]

respawn
respawn limit 20 5

limit nofile 32768 32768

script
    export HOME="/root"
    chdir /opt/a-bridge
    exec sudo -u www-data PORT=8080 NODE_ENV=production /usr/local/bin/node /opt/a-bridge/index.js >> /opt/a-bridge/logs/app.log 2>&1
end script

pre-start script
    echo "`date -u +%Y-%m-%dT%T.%3NZ`: starting" >> /opt/a-bridge/logs/app.log
end script

pre-stop script
    echo "[`date -u +%Y-%m-%dT%T.%3NZ`]: stopping" >> /opt/a-bridge/logs/app.log
end script
```

### Setup Database
*development*
```console
gulp db:create
gulp db:migrate
gulp db:seed:mysql
gulp db:seed:redis
```

*production*

The database should be already setup in prod. If it isn't, you can make a gulp task similar to the dev db:migrate that will set it up for you.
For changes to the db:
```console
gulp db:migrate:production
NODE_ENV=production gulp db:seed:mysql
NODE_ENV=production gulp db:seed:redis
```

We are using sequelize as the ORM for the database, the documentation is here, and is quite good:
http://sequelize.readthedocs.org/en/latest/docs/associations/#one-to-many-associations

### Start server:

*Production:*
```console
sudo start a-bridge
```
or after making changes:
```console
sudo stop a-bridge
sudo start a-bridge
```
OR
```console
npm restart
```

*Development (with jshint and nodemon):*
```console
npm start
```

### Available Tasks
A list of tasks available to make your life easier

```console
npm test
npm start
npm run prod-start
npm stop
gulp db:create
gulp db:drop
gulp db:migrate
gulp db:migrate:production
gulp db:test:prepare
gulp db:seed
gulp db:seed:production
```

### Testing:

#### Run test suite:

If running for the first time, or on a new instance of the server:
```console
gulp db:test:prepare
```

Then

```console
npm test
```

#### To send a test post to a-bridge:

*Bridge Up*
```console
node modules/send-test-post.js
```

*Bridge Down*
```console
node modules/send-test-post.js -s false
```

*Scheduled Lift*
```console
node modules/send-test-post.js -dS
```

*Create User Development*
```console
node modules/send-test-post.js -u user@example.com
```

*Create User Production USE WITH CARE*
```console
NODE_ENV=production node modules/send-test-post.js -u user@example.com -h a-bridge.api.multco.us
```

*Options*
```console
                    ~~ HTTP POST body options ~~

-S | --scheduled   : Boolean flag. If included, the message sent will mock
                     a lift event being scheduled.

If not a scheduled lift, the post will mock an actual lift event, and the
following options will be available; otherwise, they will be ignored.

-s | --status      : Specify true or false. true: bridge is raising, false:
                     bridge is down. Default is up (true).

The following options are available for both scheduled mocks and actual
event mocks.

-b | --bridge      : The bridge you are mocking. Default is "bailey's
                     bridge".
-d | --defaultPath : Boolean flag. If true, it will send the message to the
                     default path for that message type. Default for
                     scheduled event is '/bridges/events/scheduled', default
                     for actual events is '/bridges/events/actual'. If not
                     passed, message will be sent to
                     '/bridges/events/actual'.
-t | --timeStamp   : Timestamp for the bridge event, in `new
                     Date().toString()` format. Default is the moment the
                     post is sent. If a scheduled event, this will be the
                     default requestTime.

The following options are available only for scheduled event mocks.

-T | --type        : The type of the scheduled lift event. Default is
                     `testing`.
-l | --liftTime    : If a scheduled event, the time at which the bridge will
                     lift

                    ~~ HTTP POST request options ~~

-h | --hostname  : IP Address for where a-bridge instance is located.
                   Default is the ip for your machine.
-H | --headers   : Headers for HTTP method. Defaults are:

                    {
                      "Content-Type":   "application/json",
                      "Content-Length": message.length,
                      "Authorization": "Bearer 1234"
                    }

-m | --method    : HTTP method to use for request. Default is `POST`.
-p | --port      : Port at `hostname` to send to. Default is `80`.
-P | --path      : Path at `hostname:port` to send to. If -d flag is passed,
                   this option will be ignored.
-u | --user      : Create a user for authentication to the api. Use the syntax
                   -u user@email.com, replacing the email with an actual email.

Any other arguments without `-` or `--` will be sent as an array of values assigned to the property `othMsgVals` on the http post body:

  > node modules/send-test-post.js -b "cuevas crossing" -s false foo bar
  {
    "bridge":    "cuevas crossing",
    "status":    "false",
    "timeStamp": "Thu Aug 13 2015 15:44:08 GMT-0700 (PDT)",
    "othMsgVals": ["foo", "bar"]
  }

Extraneous options with `-` or `--` that are not listed above will be ignored.
```

## Redis Setup For production

We are using AWS Redis as a service in production, the host and port are specified in that setup. Contact your friendly devops team to adjust or implement those settings. The current configuration for production is housed in config.json.

### Redis Setup For Development
following:
http://naleid.com/blog/2011/03/05/running-redis-as-a-user-daemon-on-osx-with-launchd
http://mac-dev-env.patrickbougie.com/redis/

#### Install Redis
Follow http://redis.io/topics/quickstart to make redis, and make Install

I downloaded the src into /usr/local/src

```console
sudo mkdir /usr/local/var/redis
sudo mkdir /usr/local/var/redis/6379
sudo mkdir /usr/local/etc/redis
```

From Redis source directory:

```console
sudo cp redis.conf /usr/local/etc/redis/redis.conf
sudo vim /usr/local/etc/redis/redis.conf
```

Change:

```shell
logfile to /usr/local/var/log/redis.log
dir to /usr/local/var/redis/6379
```

You can also add password auth with:
```shell
requirepass <password>
```


Start redis now with:

```console
sudo redis-server /usr/local/etc/redis/redis.conf
```

Then ping it:

```console
redis-cli
> ping
```
Quit redis-server with ^C

Back in console:

```console
sudo vim /Library/LaunchAgents/io.redis.redis-server.plist
```

And drop the following into that file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>io.redis.redis-server</string>

    <key>ProgramArguments</key>
    <array>
      <string>/usr/local/bin/redis-server</string>
      <string>/usr/local/etc/redis/redis.conf</string>
    </array>

    <key>StandardOutPath</key>
    <string>/usr/local/var/log/redis.log</string>
    <key>StandardErrorPath</key>
    <string>/usr/local/var/log/redis.log</string>

    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
  </dict>
</plist>
```

Then load it up on start:

```console
sudo launchctl load /Library/LaunchAgents/io.redis.redis-server.plist
```
or deregister:

```console
sudo launchctl unload /Library/LaunchAgents/io.redis.redis-server.plist
```

Also, start or stop:

```console
sudo launchctl start io.redis.redis-server
sudo launchctl stop io.redis.redis-server
```

## Updating node and npm

If you don't alread have `n` installed:
```console
sudo npm cache clean -f
sudo npm i -g n
```

Then:
```console
sudo n stable
sudo npm i -g npm
```

Testing auth strategy

curl -H "Content-Type: application/json" -H "Authorization: Bearer 1234" -X POST -d '{"bridge":"ian","status":true,"timeStamp":"Tue Aug 25 2015 09:18:38 GMT-0700 (PDT)"}' http://localhost:80/bridges/events/actual

curl -H "Content-Type: application/json" -H "Authorization: Bearer 1234" -X POST -d '{"bridge":"cuevas crossing","type":"testing","requestTime":"Tue Aug 25 2015 13:52:38 GMT-0700 (PDT)","estimatedLiftTime":"Tue Aug 25 2015 15:52:38 GMT-0700 (PDT)"}' http://52.26.186.75:80/bridges/events/scheduled
