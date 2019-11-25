import { IHttp, IHttpConfig } from '../src/contracts/IHttp';
import { FetchHttp, AxiosHttp } from '../src/http';
import { expect } from 'chai';
import { startServer, closeServer } from './server/server';
import 'isomorphic-fetch';
import { IErrorResponse } from '../src/contracts/IResponse';
import { CancelToken } from '../src/contracts/IRequest';

function run(Http: new (config?: IHttpConfig) => IHttp, port: number) {
    return new Promise((resolve) => {
        const baseURL = `http://localhost:${port}`;

        describe(Http.name, async () => {
            it('can send a GET request.', async () => {
                const http = new Http();
                const response = await http.get({ url: baseURL });

                expect(response.status).to.equal(200);
                expect(response.statusText).to.equal('OK');
                expect(response.data).to.equal('GET');
            });

            it('can send a POST request.', async () => {
                const http = new Http();
                const response = await http.post({ url: baseURL });

                expect(response.status).to.equal(200);
                expect(response.statusText).to.equal('OK');
                expect(response.data).to.equal('POST');
            });

            it('can send a PUT request.', async () => {
                const http = new Http();
                const response = await http.put({ url: baseURL });

                expect(response.status).to.equal(200);
                expect(response.statusText).to.equal('OK');
                expect(response.data).to.equal('PUT');
            });

            it('can send a PATCH request.', async () => {
                const http = new Http();
                const response = await http.patch({ url: baseURL });

                expect(response.status).to.equal(200);
                expect(response.statusText).to.equal('OK');
                expect(response.data).to.equal('PATCH');
            });

            it('can send a DELETE request.', async () => {
                const http = new Http();
                const response = await http.delete({ url: baseURL });

                expect(response.status).to.equal(200);
                expect(response.statusText).to.equal('OK');
                expect(response.data).to.equal('DELETE');
            });

            it('can retrieve a response as JSON and returned it as a parsed object.', async () => {
                const http = new Http();
                const response = await http.get({ url: `${baseURL}/json` });

                expect(response.status).to.equal(200);
                expect(response.statusText).to.equal('OK');
                expect(response.data.foo).to.equal('bar');
            });

            it('can post some information an get some data back relating to that request.', async () => {
                const http = new Http();
                const response = await http.post({
                    url: `${baseURL}/foo`,
                    body: { foo: true },
                });

                expect(response.status).to.equal(200);
                expect(response.statusText).to.equal('OK');
                expect(response.data.foo).to.equal('bar');
            });

            it('can catch a 404 error and format it into the IErrorResponse format.', async () => {
                const http = new Http();
                let error: IErrorResponse|null = null;

                try {
                    await http.get({ url: `${baseURL}/404` });
                } catch (e) {
                    error = e;
                }

                if (error && error.response) {
                    expect(error.code).to.equal(404);
                    expect(error.response.status).to.equal(404);
                } else {
                    expect(false, 'The error wasn\'t thrown.').to.be.true;
                }
            });

            it('should send a GET request if the method is left blank.', async () => {
                const http = new Http();
                const response = await http.request({ url: baseURL });

                expect(response.status).to.equal(200);
                expect(response.statusText).to.equal('OK');
                expect(response.data).to.equal('GET');
            });

            it('can send a request using a string rather than an object.', async () => {
                const http = new Http();
                const response = await http.post({ url: `${baseURL}/string`, body: 'test=test' });

                expect(response.status).to.equal(200);
                expect(response.statusText).to.equal('OK');
                expect(response.data).to.equal('success');
            });

            it('can get an error response which is a plain string.', async () => {
                const http = new Http();
                let error: IErrorResponse|null = null;

                try {
                    await http.get({ url: `${baseURL}/string/error` });
                } catch (e) {
                    error = e;
                }

                expect(error).to.be.a('object');
                if (error && error.response) {
                    expect(error.code).to.equal(400);
                    expect(error.response.data).to.equal('error');
                }
            });

            it('can create a cancel token and then cancel a request', (done) => {
                const http = new Http();
                let cancel: CancelToken = (message?: string) => {};

                const promise = http.get({
                    url: `${baseURL}/cancel`,
                    cancelToken: (c) => {
                        cancel = c;
                    },
                });

                promise.then(() => {
                        done(new Error('The promise succeeded, this should be canceled.'));
                    }).catch((error: IErrorResponse) => {
                        expect(error.code).to.be.undefined;
                        done();
                    });

                if (cancel !== null) {
                    cancel();
                } else {
                    done(new Error('The cancel token wasn\'t generated.'));
                }
            });

            before(() => startServer(port));
            after(() => closeServer(port));
        });
    });
}

run(AxiosHttp, 13337);
run(FetchHttp, 13338);
