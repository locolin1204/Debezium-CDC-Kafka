import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { OrderResponseDto } from "../types/OrderResponseDto";


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
      private http: HttpClient
  ) { }

  private orderUrl = 'http://localhost:8080/order';

  getOrders(): Observable<OrderResponseDto[]> {
    return this.http.get<OrderResponseDto[]>(`${this.orderUrl}/all`);
  }
}
