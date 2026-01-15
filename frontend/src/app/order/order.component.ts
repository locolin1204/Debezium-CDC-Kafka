import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from "../service/websocket.service";
import { Message } from '@stomp/stompjs';
import { NgStyle } from "@angular/common";
import { Subscription } from "rxjs";
import { Order } from "../types/Order";
import { OrderService } from "../service/order.service";
import { MatTableModule } from '@angular/material/table';
import { parseOrder } from "../util/parser";
import { OrderLog } from "../types/OrderLog";

@Component({
  selector: 'app-order',
  standalone: true,
    imports: [
        MatTableModule,
        NgStyle
    ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit, OnDestroy {
  orderList: Order[] = []
  orderLogs: OrderLog[] = [];
  private topicSubscription!: Subscription;

  constructor(private websocketService: WebsocketService, private orderService: OrderService) { }
  orderDisplayedColumns: string[] = ['id', 'productName', 'quantity', 'createdDatetime', 'lastModifiedDatetime'];
  orderLogsDisplayedColumns: string[] = ['op', 'id', 'productName', 'quantity', 'createdDatetime', 'lastModifiedDatetime'];


  ngOnInit(): void {
    this.orderService.getOrders().subscribe(
        orders => {
          this.orderList = orders.map(order => parseOrder(order)) as Order[];
          this.orderList.sort((a, b) => a.id - b.id);
        }
    )

    this.topicSubscription = this.websocketService
        .watch('/topic/order')
        .subscribe((message: Message) => {
          const newLog = parseOrder(message.body) as OrderLog;
          if (newLog) {
            this.orderLogs = [...this.orderLogs, newLog]
            console.log("order log", this.orderLogs);
            if (newLog.op == 'DELETE') {
                this.orderList = this.orderList.filter((order) => newLog.order.id != order.id);
            }

            if (newLog.op == 'UPDATE') {
                const index = this.orderList.findIndex(order => order.id == newLog.order.id);
                this.orderList[index] = newLog.order;
                this.orderList = [...this.orderList];
            }

            if (newLog.op == 'CREATE') {
                this.orderList = [...this.orderList, newLog.order];
            }
          }
        });
  }

  ngOnDestroy() {
    this.topicSubscription.unsubscribe();
  }

  getOperationColor(op: string) {
      switch (op) {
          case 'CREATE': return 'green';
          case 'UPDATE': return 'orange';
          case 'DELETE': return 'red';
          default: return 'black';
      }
  }
}
