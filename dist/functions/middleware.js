export function runResponseMiddleware(response, resolve, reject, middlewares) {
    let middleware;
    if (middleware = middlewares.shift()) {
        middleware(response)
            .then((response) => runResponseMiddleware(response, resolve, reject, middlewares))
            .catch((error) => reject(error));
    }
    else {
        resolve(response);
    }
}
//# sourceMappingURL=middleware.js.map