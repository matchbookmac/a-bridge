## Redis Setup (Dev)
following:
http://naleid.com/blog/2011/03/05/running-redis-as-a-user-daemon-on-osx-with-launchd
http://mac-dev-env.patrickbougie.com/redis/
### Install Redis
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
