import { IResponse } from '../contracts/IResponse';
import { ResponseMiddleware } from '../types';
declare type ResponseResolver = (value?: IResponse | PromiseLike<IResponse> | undefined) => void;
export declare function runResponseMiddleware(response: IResponse, resolve: ResponseResolver, middlewares: ResponseMiddleware[]): void;
export {};
//# sourceMappingURL=middleware.d.ts.map