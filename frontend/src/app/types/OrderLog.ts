import { Operation } from "./Operation";
import { Order } from "./Order";

export interface OrderLog {
    order: Order;
    op: Operation;
}