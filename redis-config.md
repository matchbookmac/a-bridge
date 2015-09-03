## Redis Setup (Dev)

### Install Redis
Follow http://redis.io/topics/quickstart to make redis, and make Install

I moved the source file to ~/Applications or you can just leave it in ~

```console
sudo mkdir /var/redis/6379
sudo mkdir /etc/redis
```

From Redis source directory:

```console
sudo cp redis.conf /etc/redis/redis.conf
sudo vim /etc/redis/redis.conf
```

Change:

```shell
logfile to /var/log/redis.log
dir to /var/redis/6379
```

Start redis now with:

```console
sudo redis-server /etc/redis/redis.conf
```

Then ping it:

```console
redis-cli
> ping
```
Quit redis-server with ^C

Back in console:

```console
mkdir ~/Library/LaunchAgents
```

if it doesn't exist. Then

```console
vim ~/Library/LaunchAgents/io.redis.redis-server.plist
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
      <string>/usr/local/redis/bin/redis-server</string>
      <string>/usr/local/redis/redis.conf</string>
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
launchctl load ~/Library/LaunchAgents/io.redis.redis-server.plist
```
or deregister:

```console
launchctl unload ~/Library/LaunchAgents/io.redis.redis-server.plist
```
