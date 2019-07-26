import * as express from 'express';
import { Server } from 'http';
import * as SocketIO from 'socket.io';
import * as basicAuth from 'basic-auth-connect';
import * as moment from 'moment';
import * as mkdirp from 'mkdirp';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import { promises as fs } from 'fs';

const app = express();
const http = new Server(app);
const io = SocketIO(http);

const logPath = `${__dirname}/logs`;
mkdirp(logPath, (err, made) => {});

app.use(cors());
app.use(helmet());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

app.get(
  '/',
  basicAuth(process.env.HTTP_AUTH_USER, process.env.HTTP_AUTH_PASSWORD),
  (req, res) => {
    res.sendFile(`${__dirname}/logger.html`);
});

app.get(
  '/logger/:date',
  basicAuth(process.env.HTTP_AUTH_USER, process.env.HTTP_AUTH_PASSWORD),
  (req, res) => {
    try {
      res.sendFile(`${__dirname}/logs/${req.params.date}.log`);
    } catch (err) {
      res.send({
        err: 'Log not found'
      });
    }
});

io.on('connection', (socket) => {
  socket.on('save-log', (data) => {
    socket.broadcast.emit('get-log', data);
    fs.appendFile(`${__dirname}/logs/${moment().format('DD.MM.YYYY')}.log`, data + '\n');
  });

  app.post(
    '/logger',
    basicAuth(process.env.HTTP_AUTH_USER, process.env.HTTP_AUTH_PASSWORD),
    (req, res) => {
      try {
        fs.appendFileSync(`${__dirname}/logs/${moment().format('DD.MM.YYYY')}.log`, req.body.dataLog + '\n');
        socket.broadcast.emit('get-log', req.body.dataLog);
        res.send({
          saved: true
        });
      } catch (err) {
        res.send({
          err
        })
      }
    });

  console.log('[socket.io] user connected');
  socket.on('disconnect', () => {
    console.log('[socket.io] user disconnected');
  });
});

http.listen(process.env.PORT, function () {
  console.log(`listening on *:${process.env.PORT}`);
});
