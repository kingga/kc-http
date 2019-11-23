export interface ServerInfo {
    port: number;
}
export declare function startServer(port: number): Promise<ServerInfo>;
export declare function closeServer(port: number): Promise<void>;
//# sourceMappingURL=server.d.ts.map