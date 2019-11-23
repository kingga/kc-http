import { IResponse } from "./contracts/IResponse";
import { IRequest } from "./contracts/IRequest";

export type RequestMethod = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH';
export type ResponseMiddleware = (response: IResponse) => Promise<IResponse>;
export type RequestMiddleware = (request: IRequest) => Promise<IRequest>;
