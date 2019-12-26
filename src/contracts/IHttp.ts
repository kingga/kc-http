import { RequestMiddleware, ResponseMiddleware } from '../types';
import { IRequest } from './IRequest';
import { IResponse } from './IResponse';

interface Headers {
    [key: string]: string;
}

export interface IHttpConfig {
    baseURL?: string;
    headers?: Headers;
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
    getConfig(): IHttpConfig;
    setHeader(header: string, value: any): IHttp;
    addResponseMiddleware(middleware: ResponseMiddleware): IHttp;
    addRequestMiddleware(middleware: RequestMiddleware): IHttp;
}
