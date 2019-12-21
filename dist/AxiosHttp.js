import Axios from 'axios';
import { runResponseMiddleware } from './functions/middleware';
export default class AxiosHttp {
    constructor(config) {
        this.config = config || {};
        this.axios = Axios.create({
            baseURL: this.config.baseURL || undefined,
            headers: this.config.headers || {},
            data: this.config.data || undefined,
        });
    }
    request(request) {
        return new Promise((resolve, reject) => {
            const config = {
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
                runResponseMiddleware(this.formatAxiosResponse(response, request), resolve, reject, [...(this.config.responseMiddleware || [])]);
            })
                .catch((error) => reject(this.formatAxiosError(error, request)));
        });
    }
    get(request) {
        request.method = 'GET';
        return this.request(request);
    }
    post(request) {
        request.method = 'POST';
        return this.request(request);
    }
    put(request) {
        request.method = 'PUT';
        return this.request(request);
    }
    patch(request) {
        request.method = 'PATCH';
        return this.request(request);
    }
    delete(request) {
        request.method = 'DELETE';
        return this.request(request);
    }
    getConfig() {
        return this.config;
    }
    setHeader(header, value) {
        if (!this.config.headers) {
            this.config.headers = {};
        }
        this.config.headers[header] = value;
        return this;
    }
    formatAxiosResponse(response, request) {
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            request,
        };
    }
    formatAxiosError(error, request) {
        const response = error.response ? this.formatAxiosResponse(error.response, request) : undefined;
        const code = response ? response.status : undefined;
        const { message, name } = error;
        return { code, message, name, response, request };
    }
}
//# sourceMappingURL=AxiosHttp.js.map