import { RxStompConfig } from "@stomp/rx-stomp";

export const rxStompConfig: RxStompConfig = {
    // Which server?
    brokerURL: 'ws://localhost:8080/ws',

    // Heartbeats (ms). Set 0 to disable.
    heartbeatIncoming: 0,
    heartbeatOutgoing: 20000,

    // Reconnect delay (ms). Set 0 to disable.
    reconnectDelay: 200,

    // Console diagnostics (avoid in production)
    debug: (msg: string): void => {
        console.log(new Date(), msg);
    },
};