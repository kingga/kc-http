import { ResponseMiddleware, RequestMiddleware } from '../types';
import { IRequest } from './IRequest';
import { IResponse } from './IResponse';
export interface IHttpConfig {
    baseURL?: string;
    headers?: Object;
    data?: any;
    responseMiddleware?: ResponseMiddleware[];
    requestMiddleware?: RequestMiddleware[];
}
export interface IHttp {
    request(request: IRequest): Promise<IResponse>;
    get(request: IRequest): Promise<IResponse>;
    post(request: IRequest): Promise<IResponse>;
    put(request: IRequest): Promise<IResponse>;
    patch(request: IRequest): Promise<IResponse>;
    delete(request: IRequest): Promise<IResponse>;
}
//# sourceMappingURL=IHttp.d.ts.map