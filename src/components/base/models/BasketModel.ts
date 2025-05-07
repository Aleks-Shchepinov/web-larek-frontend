export interface BasketItem {
	id: string;
	title: string;
	price: number;
	category?: string;
}

export class BasketModel {
	private cartItems: BasketItem[] = [];

	addToCart(product: BasketItem) {
		if (product.price === null) return;

		if (!this.cartItems.find((item) => item.id === product.id)) {
			this.cartItems.push(product);
		}
	}

	removeFromCart(productId: string) {
		this.cartItems = this.cartItems.filter((item) => item.id !== productId);
	}

	clearCart() {
		this.cartItems = [];
	}

	getCartItems(): BasketItem[] {
		return this.cartItems;
	}

	getTotalPrice(): number {
		return this.cartItems.reduce((sum, item) => sum + item.price, 0);
	}

	hasProduct(productId: string): boolean {
		return this.cartItems.some((item) => item.id === productId);
	}

	getCount(): number {
		return this.cartItems.length;
	}
}
