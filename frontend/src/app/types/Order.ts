export interface Order {
    id: number;
    productName: string;
    quantity: number;
    createdDatetime: Date;
    lastModifiedDatetime: Date;
}