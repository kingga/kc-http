var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { runResponseMiddleware } from './functions/middleware';
export default class FetchHttp {
    constructor(config) {
        this.config = config || {};
    }
    request(request) {
        return new Promise((resolve, reject) => {
            const body = this.createBody(request);
            const config = {
                method: request.method,
                headers: Object.assign({}, request.headers, this.config.headers || {}),
                body,
            };
            if (request.cancelToken) {
                const controller = new AbortController();
                config.signal = controller.signal;
                const cancel = () => controller.abort();
                request.cancelToken(cancel);
            }
            fetch(request.url, config)
                .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                this.formatFetchResponse(response, request)
                    .then((response) => {
                    runResponseMiddleware(response, resolve, reject, [...(this.config.responseMiddleware || [])]);
                });
            })
                .catch((error) => __awaiter(this, void 0, void 0, function* () { return reject(yield this.formatFetchError(error, request)); }));
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
    addResponseMiddleware(middleware) {
        if (!this.config.responseMiddleware) {
            this.config.responseMiddleware = [];
        }
        this.config.responseMiddleware.push(middleware);
        return this;
    }
    addRequestMiddleware(middleware) {
        if (!this.config.requestMiddleware) {
            this.config.requestMiddleware = [];
        }
        this.config.requestMiddleware.push(middleware);
        return this;
    }
    parseFetchResponse(response) {
        return new Promise((resolve, reject) => {
            if (response instanceof Error) {
                return resolve(response.message);
            }
            response.text().then((text) => {
                let data;
                try {
                    data = JSON.parse(text);
                }
                catch (_e) {
                    data = text;
                }
                resolve(data);
            });
        });
    }
    getResponseObject(data, response, request) {
        return {
            data,
            status: response.status,
            statusText: response.statusText,
            headers: this.castHeadersToRecord(response.headers),
            request,
        };
    }
    formatFetchResponse(response, request) {
        return new Promise((resolve) => {
            this.parseFetchResponse(response)
                .then((data) => resolve(this.getResponseObject(data, response, request)));
        });
    }
    formatFetchError(error, request) {
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
    createBody(request) {
        if (!request.headers) {
            request.headers = {};
        }
        if (typeof request.body === 'string' || !request.body) {
            if (!request.headers['Content-Type']) {
                request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            return request.body || '';
        }
        request.headers['Content-Type'] = 'application/json';
        return JSON.stringify(request.body);
    }
    castHeadersToRecord(headers) {
        const record = {};
        (headers || []).forEach((v, k) => record[k] = v);
        return record;
    }
}
//# sourceMappingURL=FetchHttp.js.map