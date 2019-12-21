import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { IHttp, IHttpConfig } from './contracts/IHttp';
import { IRequest } from './contracts/IRequest';
import { IErrorResponse, IResponse } from './contracts/IResponse';
import { runResponseMiddleware } from './functions/middleware';

export default class AxiosHttp implements IHttp {
    protected axios: AxiosInstance;
    protected config: IHttpConfig;

    constructor(config?: IHttpConfig) {
        this.config = config || {};
        this.axios = Axios.create({
            baseURL: this.config.baseURL || undefined,
            headers: this.config.headers || {},
            data: this.config.data || undefined,
        });
    }

    public request(request: IRequest): Promise<IResponse> {
        return new Promise((resolve, reject) => {
            const config: AxiosRequestConfig = {
                url: request.url,
                method: request.method || 'GET',
                data: request.body || undefined,
                headers: Object.assign({}, request.headers || {}, this.config.headers || {}),
            };

            if (request.cancelToken) {
                config.cancelToken = new Axios.CancelToken(request.cancelToken);
            }

            this.axios.request(config)
                .then((response) => {
                    runResponseMiddleware(
                        this.formatAxiosResponse(response, request),
                        resolve,
                        reject,
                        [...(this.config.responseMiddleware || [])]
                    );
                })
                .catch((error: AxiosError) => reject(this.formatAxiosError(error, request)));
        });
    }

    public get(request: IRequest): Promise<IResponse> {
        request.method = 'GET';

        return this.request(request);
    }

    public post(request: IRequest): Promise<IResponse> {
        request.method = 'POST';

        return this.request(request);
    }

    public put(request: IRequest): Promise<IResponse> {
        request.method = 'PUT';

        return this.request(request);
    }

    public patch(request: IRequest): Promise<IResponse> {
        request.method = 'PATCH';

        return this.request(request);
    }

    public delete(request: IRequest): Promise<IResponse> {
        request.method = 'DELETE';

        return this.request(request);
    }

    public getConfig(): IHttpConfig {
        return this.config;
    }

    public setHeader(header: string, value: any): IHttp {
        if (!this.config.headers) {
            this.config.headers = {};
        }

        this.config.headers[header] = value;

        return this;
    }

    protected formatAxiosResponse(response: AxiosResponse, request: IRequest): IResponse {
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            request,
        };
    }

    protected formatAxiosError(error: AxiosError, request: IRequest): IErrorResponse {
        const response = error.response ? this.formatAxiosResponse(error.response, request) : undefined;
        const code = response ? response.status : undefined;
        const { message, name } = error;

        return { code, message, name, response, request };
    }
}
