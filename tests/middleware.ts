import { runResponseMiddleware } from '../src/functions/middleware';
import { IResponse } from '../src/contracts/IResponse';
import { expect } from 'chai';
import { createResponse } from './helpers';

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
});
