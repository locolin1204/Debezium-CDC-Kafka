import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from "../service/websocket.service";
import { Message } from '@stomp/stompjs';
import { NgForOf } from "@angular/common";
import { Subscription } from "rxjs";
import { Order } from "../types/Order";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit, OnDestroy {
  receivedMessages: Order[] = [];
  private topicSubscription!: Subscription;

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.topicSubscription = this.websocketService
        .watch('/topic/order')
        .subscribe((message: Message) => {
          this.receivedMessages.push(this.parseOrder(message.body));
        });
  }

  private parseOrder(body: string): Order {
    try {
      const data = JSON.parse(body);
      console.log({ data });

      return {
        id: data.id,
        productName: data.product_name,
        quantity: data.quantity,
        createdDatetime: new Date(data.created_datetime),
        lastModifiedDatetime: new Date(data.last_modified_datetime),
      };
    } catch (error) {
      console.error('Failed to parse Order from message:', body, error);
      throw error;
    }
  }

  ngOnDestroy() {
    this.topicSubscription.unsubscribe();
  }

}
