import { RequestMethod } from '../types';

export type CancelToken = () => void;
export type Canceler = (token: CancelToken) => void;

export interface IRequest {
    url: string;
    method?: RequestMethod;
    body?: any;
    headers?: Record<string, string>;
    cancelToken?: Canceler;
}
