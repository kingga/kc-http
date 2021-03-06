import { expect } from 'chai';

import { IResponse } from '../src/contracts/IResponse';
import { runResponseMiddleware } from '../src/functions/middleware';
import { AxiosHttp, FetchHttp, IRequest } from '../src/http';
import { createResponse } from './helpers';
import { closeServer, startServer } from './server/server';

describe('Middleware', () => {
    it('should be able to run through multiple middleware.', async () => {
        const response = createResponse();

        const promise: Promise<IResponse> = new Promise((resolve, reject) => {
            runResponseMiddleware(response, resolve, reject, [
                (response: IResponse): Promise<IResponse> => {
                    return new Promise((resolve) => {
                        response.data.faz = 'baz';
                        resolve(response);
                    });
                },
                (response: IResponse): Promise<IResponse> => {
                    return new Promise((resolve) => {
                        response.data.changed = true;
                        resolve(response);
                    });
                },
            ]);
        });

        const result = await promise;
        expect(result.data.faz).to.equal('baz');
        expect(result.data.changed).to.equal(true);
    });

    it('should be able to stop the response from reaching the final destination.', async () => {
        const response = createResponse();
        const error = { error: 'Cancelled' };
        let e;

        const promise: Promise<IResponse> = new Promise((resolve, reject) => {
            runResponseMiddleware(response, resolve, reject, [
                (response: IResponse): Promise<IResponse> => {
                    return new Promise((_resolve, reject) => {
                        response.data.faz = 'baz';
                        reject(error);
                    });
                },
                (response: IResponse): Promise<IResponse> => {
                    return new Promise((resolve) => {
                        response.data.changed = true;
                        resolve(response);
                    });
                },
            ]);
        });

        try {
            await promise;
        } catch (_e) {
            e = _e;
        }


        expect(e).to.equal(error);
    });

    it('can run the middleware more than once', async () => {
        await startServer(13339);
        const baseURL = 'http://localhost:13339';
        const config = {
            responseMiddleware: [
                async (response) => {
                    response.data.throughMiddleware = true;

                    return response;
                },
            ],
        };

        const fetch = new FetchHttp(config);
        const axios = new AxiosHttp(config);

        const r1 = await fetch.get({ url: `${baseURL}/json` });
        const r2 = await fetch.get({ url: `${baseURL}/json` });
        const r3 = await axios.get({ url: `${baseURL}/json` });
        const r4 = await axios.get({ url: `${baseURL}/json` });

        expect(r1.data.throughMiddleware).to.be.true;
        expect(r2.data.throughMiddleware).to.be.true;
        expect(r3.data.throughMiddleware).to.be.true;
        expect(r4.data.throughMiddleware).to.be.true;

        await closeServer(13339);
    }).timeout(10000);

    it('can add some custom response middleware after creation', () => {
        const fetch = new FetchHttp();
        const axios = new AxiosHttp();

        const middleware = async (response: IResponse) => {
            response.data.marked = true;

            return response;
        };

        fetch.addResponseMiddleware(middleware);
        axios.addResponseMiddleware(middleware);

        expect(fetch.getConfig().responseMiddleware).to.have.lengthOf(1);
        expect(axios.getConfig().responseMiddleware).to.have.lengthOf(1);
        expect(fetch.getConfig().responseMiddleware[0]).to.deep.equal(middleware);
        expect(axios.getConfig().responseMiddleware[0]).to.deep.equal(middleware);
    });

    it('can add some custom response middleware after creation', () => {
        const fetch = new FetchHttp();
        const axios = new AxiosHttp();

        const middleware = async (request: IRequest) => {
            request.body.marked = true;

            return request;
        };

        fetch.addRequestMiddleware(middleware);
        axios.addRequestMiddleware(middleware);

        expect(fetch.getConfig().requestMiddleware).to.have.lengthOf(1);
        expect(axios.getConfig().requestMiddleware).to.have.lengthOf(1);
        expect(fetch.getConfig().requestMiddleware[0]).to.deep.equal(middleware);
        expect(axios.getConfig().requestMiddleware[0]).to.deep.equal(middleware);
    });
});
