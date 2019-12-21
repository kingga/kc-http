import { IHttp, IHttpConfig } from './contracts/IHttp';
import { CancelToken, IRequest } from './contracts/IRequest';
import { IErrorResponse, IResponse } from './contracts/IResponse';
import { runResponseMiddleware } from './functions/middleware';

export default class FetchHttp implements IHttp {
    protected config: IHttpConfig;

    public constructor(config?: IHttpConfig) {
        this.config = config || {};
    }

    public request(request: IRequest): Promise<IResponse> {
        return new Promise((resolve, reject) => {
            const body = this.createBody(request);
            const config: RequestInit = {
                method: request.method,
                headers: Object.assign({}, request.headers, this.config.headers || {}),
                body,
            };

            if (request.cancelToken) {
                const controller = new AbortController();
                config.signal = controller.signal;

                const cancel: CancelToken = (): void => controller.abort();
                request.cancelToken(cancel);
            }

            fetch(request.url, config)
                .then((response) => {
                    if (!response.ok) {
                        throw response;
                    }

                    this.formatFetchResponse(response, request)
                        .then((response) => {
                            runResponseMiddleware(
                                response,
                                resolve,
                                reject,
                                [...(this.config.responseMiddleware || [])]
                            );
                        });
                })
                .catch(async (error: Response) => reject(await this.formatFetchError(error, request)));
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

    protected parseFetchResponse(response: Response | Error): Promise<string | any> {
        return new Promise((resolve, reject) => {
            if (response instanceof Error) {
                return resolve(response.message);
            }

            response.text().then((text) => {
                // Try to parse it into an object.
                let data: any;

                try {
                    data = JSON.parse(text);
                } catch (_e) {
                    data = text;
                }

                resolve(data);
            });
        });
    }

    protected getResponseObject(data: any, response: Response, request: IRequest): IResponse {
        return {
            data,
            status: response.status,
            statusText: response.statusText,
            headers: this.castHeadersToRecord(response.headers),
            request,
        };
    }

    protected formatFetchResponse(response: Response, request: IRequest): Promise<IResponse> {
        return new Promise((resolve) => {
            this.parseFetchResponse(response)
                .then((data) => resolve(this.getResponseObject(data, response, request)));
        });
    }

    protected formatFetchError(error: Response, request: IRequest): Promise<IErrorResponse> {
        return new Promise((resolve) => {
            this.parseFetchResponse(error)
                .then((data) => resolve({
                    code: error.status,
                    message: typeof data === 'string' ? data : JSON.stringify(data),
                    name: error.statusText,
                    response: this.getResponseObject(data, error, request),
                    request,
                }));
        });
    }

    protected createBody(request: IRequest): string {
        if (!request.headers) {
            request.headers = {};
        }

        // If the request body is not a string (or not set) set the request
        // header application/json and stringify the object.
        if (typeof request.body === 'string' || !request.body) {
            if (!request.headers['Content-Type']) {
                request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }

            return request.body || '';
        }

        request.headers['Content-Type'] = 'application/json';

        return JSON.stringify(request.body);
    }

    protected castHeadersToRecord(headers: Headers): Record<string, string> {
        const record: Record<string, string> = {};
        (headers || []).forEach((v, k) => record[k] = v);

        return record;
    }
}
