import { Injectable } from '@angular/core';
import { RxStomp } from "@stomp/rx-stomp";
import { rxStompConfig } from "./rx-stomp.config";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService extends RxStomp {
  constructor() {
    super()
    this.configure(rxStompConfig)
    this.activate()
  }

  subscribeToTopic(topic: string) {
    return this.watch(topic);
  }
}
