import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrderComponent } from "./order/order.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, OrderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cdc-kafka-debezium';
}
