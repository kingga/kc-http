import { IResponse } from "./contracts/IResponse";
import { IRequest } from "./contracts/IRequest";
export declare type RequestMethod = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH';
export declare type ResponseMiddleware = (response: IResponse) => Promise<IResponse>;
export declare type RequestMiddleware = (request: IRequest) => Promise<IRequest>;
//# sourceMappingURL=types.d.ts.map