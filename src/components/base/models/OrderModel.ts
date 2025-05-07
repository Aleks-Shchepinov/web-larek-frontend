import { BasketModel } from './BasketModel';

interface OrderData {
	paymentMethod: string;
	address: string;
	email?: string;
	phone?: string;
}

export class OrderModel {
	private orderData: OrderData | null = null;

	constructor(private basketModel: BasketModel) {}

	setOrderData(data: Partial<OrderData>): void {
		this.orderData = {
			...this.orderData,
			...data,
		};
	}

	completeOrder(): void {
		this.basketModel.clearCart();
		this.orderData = null;
	}
}
