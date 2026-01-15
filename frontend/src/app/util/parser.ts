import { Order } from "../types/Order";
import { OrderResponseDto } from "../types/OrderResponseDto";
import { OrderLog } from "../types/OrderLog";

export function parseOrder(rawOrder: string | OrderResponseDto): Order | OrderLog | undefined{
    try {
        if (typeof rawOrder == "string") {
            const data = JSON.parse(rawOrder);
            console.log({ data });
            return {
                op: data.op,
                order: {
                    id: data.order.id,
                    productName: data.order.product_name,
                    quantity: data.order.quantity,
                    createdDatetime: new Date(data.order.created_datetime),
                    lastModifiedDatetime: new Date(data.order.last_modified_datetime),
                }
            } as OrderLog;
        }
        if (typeof rawOrder == "object") {
            console.log("object:")
            console.log(rawOrder);
            return {
                id: rawOrder.id,
                productName: rawOrder.product_name,
                quantity: rawOrder.quantity,
                createdDatetime: new Date(rawOrder.created_datetime * 1000),
                lastModifiedDatetime: new Date(rawOrder.last_modified_datetime * 1000),
            } as Order;
        }

        return undefined;


    } catch (error) {
        console.error('Failed to parse Order from message:', rawOrder, error);
        throw error;
    }
}