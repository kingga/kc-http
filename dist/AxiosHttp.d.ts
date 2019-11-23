import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { IRequest } from './contracts/IRequest';
import { IResponse, IErrorResponse } from './contracts/IResponse';
import { IHttp, IHttpConfig } from './contracts/IHttp';
export default class AxiosHttp implements IHttp {
    protected axios: AxiosInstance;
    protected config: IHttpConfig;
    constructor(config?: IHttpConfig);
    request(request: IRequest): Promise<IResponse>;
    get(request: IRequest): Promise<IResponse>;
    post(request: IRequest): Promise<IResponse>;
    put(request: IRequest): Promise<IResponse>;
    patch(request: IRequest): Promise<IResponse>;
    delete(request: IRequest): Promise<IResponse>;
    protected formatAxiosResponse(response: AxiosResponse, request: IRequest): IResponse;
    protected formatAxiosError(error: AxiosError, request: IRequest): IErrorResponse;
}
//# sourceMappingURL=AxiosHttp.d.ts.map