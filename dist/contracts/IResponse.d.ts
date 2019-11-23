import { IRequest } from './IRequest';
export interface IResponse {
    data: any;
    status: number;
    statusText: string;
    headers: object;
    request: IRequest;
}
export interface IErrorResponse {
    code?: number;
    message: string;
    name: string;
    response?: IResponse;
    request: IRequest;
}
//# sourceMappingURL=IResponse.d.ts.map