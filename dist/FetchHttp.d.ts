import { IHttp, IHttpConfig } from './contracts/IHttp';
import { IRequest } from './contracts/IRequest';
import { IErrorResponse, IResponse } from './contracts/IResponse';
export default class FetchHttp implements IHttp {
    protected config: IHttpConfig;
    constructor(config?: IHttpConfig);
    request(request: IRequest): Promise<IResponse>;
    get(request: IRequest): Promise<IResponse>;
    post(request: IRequest): Promise<IResponse>;
    put(request: IRequest): Promise<IResponse>;
    patch(request: IRequest): Promise<IResponse>;
    delete(request: IRequest): Promise<IResponse>;
    getConfig(): IHttpConfig;
    setHeader(header: string, value: any): IHttp;
    protected parseFetchResponse(response: Response | Error): Promise<string | any>;
    protected getResponseObject(data: any, response: Response, request: IRequest): IResponse;
    protected formatFetchResponse(response: Response, request: IRequest): Promise<IResponse>;
    protected formatFetchError(error: Response, request: IRequest): Promise<IErrorResponse>;
    protected createBody(request: IRequest): string;
    protected castHeadersToRecord(headers: Headers): Record<string, string>;
}
//# sourceMappingURL=FetchHttp.d.ts.map