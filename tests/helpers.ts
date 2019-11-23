import { IRequest } from '../src/contracts/IRequest';
import { IResponse } from '../src/contracts/IResponse';

export function createRequest(): IRequest {
    return { url: '' };
};

export function createResponse(response?: IResponse): IResponse {
    const created = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        request: createRequest(),
    };

    if (typeof response === 'object') {
        created.data = response.data || created.data;
        created.status = response.status || created.status;
        created.statusText = response.statusText || created.statusText;
        created.headers = response.headers || created.headers;
        created.request = response.request || created.request;
    }

    return created;
}
