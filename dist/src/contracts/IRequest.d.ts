import { RequestMethod } from '../types';
export interface IRequest {
    url: string;
    method?: RequestMethod;
    body?: any;
    headers?: Record<string, string>;
}
//# sourceMappingURL=IRequest.d.ts.map