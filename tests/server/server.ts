import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Server } from 'http';

const app = express();
let servers: Server[] = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.get('/', (_req, res) => res.send('GET'));
app.post('/', (_req, res) => res.send('POST'));
app.put('/', (_req, res) => res.send('PUT'));
app.patch('/', (_req, res) => res.send('PATCH'));
app.delete('/', (_req, res) => res.send('DELETE'));

app.get('/404', (_req, res) => res.status(404).send(''));
app.get('/json', (_req, res) => res.json({ foo: 'bar' }));
app.post('/string', (req, res) => req.body.test === 'test' ? res.send('success') : res.status(400).send('failed'));
app.get('/string/error', (_req, res) => res.status(400).send('error'));

app.post('/foo', (req, res) => {
    if (req.body.foo === true) {
        res.json({ foo: 'bar' });
    } else {
        res.json({ faz: 'baz' });
    }
});

app.get('/cancel', (_req, res) => {
    setTimeout(() => res.status(400).send(), 5000);
});

export interface ServerInfo {
    port: number;
}

export function startServer(port: number): Promise<ServerInfo> {
    return new Promise((resolve) => {
        const info: ServerInfo = { port };

        if (!servers[port]) {
            servers[port] = app.listen(port, () => {
                resolve(info);
            });
        } else {
            resolve(info);
        }
    });
}

export function closeServer(port: number): Promise<void> {
    return new Promise((resolve) => {
        if (servers[port]) {
            servers[port].close(() => resolve());
        } else {
            resolve();
        }
    });
}
