import { RequestMethod } from '../types';
export declare type CancelToken = () => void;
export declare type Canceler = (token: CancelToken) => void;
export interface IRequest {
    url: string;
    method?: RequestMethod;
    body?: any;
    headers?: Record<string, string>;
    cancelToken?: Canceler;
}
//# sourceMappingURL=IRequest.d.ts.map