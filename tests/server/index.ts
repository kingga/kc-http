import { startServer } from './server';

startServer(13337).then((info) => {
    console.log(`Starting testing server at address http://localhost:${info.port}/`);
});
