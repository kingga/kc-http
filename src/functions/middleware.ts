import { IResponse } from '../contracts/IResponse';
import { ResponseMiddleware } from '../types';

type ResponseResolver = (value?: IResponse|PromiseLike<IResponse>|undefined) => void;

export function runResponseMiddleware(response: IResponse, resolve: ResponseResolver, reject: (error: any) => void, middlewares: ResponseMiddleware[]): void {
    let middleware: ResponseMiddleware|undefined;

    if (middleware = middlewares.shift()) {
        middleware(response)
            .then((response) => runResponseMiddleware(response, resolve, reject, middlewares))
            .catch((error) => reject(error));
    } else {
        resolve(response);
    }
}
