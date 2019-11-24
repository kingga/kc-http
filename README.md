# KC HTTP
*A wrapper around common HTTP libs*

[![Build Status](https://travis-ci.com/kingga/kc-http.svg?branch=master)](https://travis-ci.com/kingga/kc-http)

Change HTTP library without any hassle, switching between different HTTP libs could be as easy as changing one line.

## Installation

```bash
yarn add @kingga/kc-http
# OR
npm i @kingga/kc-http
```

## Usage

```typescript
import Container from '@kingga/kc-container'; // Not needed, requires yarn add @kingga/kc-container.
import { FetchHttp, IHttp } from '@kingga/kc-http';

const container = new Container();

container.bind<IHttp>('IHttp', () => new FetchHttp());

// Anywhere else in your application.
import { IHttp, IResponse, IErrorResponse } from '@kingga/kc-http';

const http = container.make<IHttp>('IHttp');
http.get({ url: '/user' })
    .then((response: IResponse) => {
        console.log(response.data);
    })
    .catch((error: IErrorResponse) => {
        console.error(error);
    });
```

## Short Docs
### Interfaces
#### IRequest

```typescript
interface IRequest {
    url: string;
    method?: RequestMethod; // E.g. GET | POST | PUT | ...
    body?: any;
    headers?: Record<string, string>;
}
```

#### IResponse

```typescript
interface IResponse {
    data: any;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    request: IRequest;
}
```

#### IErrorResponse

```typescript
interface IErrorResponse {
    code?: number,
    message: string;
    name: string;
    response?: IResponse;
    request: IRequest;
}
```
