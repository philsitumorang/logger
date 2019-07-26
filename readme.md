# Light Logger
![](https://github.com/philsitumorang/logger/blob/master/logger1.jpg?raw=true)

You can deploy logger to your machine and send POST requests to save logs.
- Logger support http requests to save logs and socket.io connection to stream logs;
- Logger show you all metrics in realtime;
- Logger save logs in to files. Format [dd.mm.yyyy].log;

### When you need Light Logger
- If you want to deploy logger faster, without additional settings;
- If you need simple metrics without format, to debug/alerts;
- if you don't want deploy heavy solution of logger;

### How to install
```bash
$ docker build . --tag logger
$ docker run -p 4000:4000 -it logger
```
You can set login/password to protect api requests and set port in `variables.env`<br/>
**PORT**=4000<br/>
**HTTP_AUTH_USER**=logger<br/>
**HTTP_AUTH_PASSWORD**=rt4241gg<br/>

### API
- GET  "/" - main page with logs
- GET  "/logger/{dd.mm.yyyy} - get logs of day
- POST "/logger", BODY: { dataLog: string } - save log
- Socket.io request - socket.emit('save-log', `some string data`)
All requests calls with http_basic_auth

### Who use Light Logger
[tokenrating.wavesexplorer.com](https://tokenrating.wavesexplorer.com) - Blockchain voting of tokens.<br/>
[oracles.wavesexplorer.com](https://oracles.wavesexplorer.com) - Create blockchain oracle for dAPP.