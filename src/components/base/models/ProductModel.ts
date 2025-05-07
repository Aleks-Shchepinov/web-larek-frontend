// Тут хранятся загруженные карточки из API

import { Api } from '../api';
import { CDN_URL } from '../../../utils/constants';

export interface Product {
	id: string;
	title: string;
	description: string;
	price: number;
	image: string;
	originalImage?: string;
	category: string;
}

export class ProductModel {
	private api: Api;
	private products: Product[] = [];
	private cdn: string;

	constructor(api: Api, cdn: string = CDN_URL) {
		this.api = api;
		this.cdn = cdn;
	}

	async loadProducts(): Promise<void> {
		const response = (await this.api.get('/product')) as { items: Product[] };
		this.products = response.items.map((item) => ({
			...item,
			image: (this.cdn + item.image).replace(/\.svg$/, '.png'),
		}));
	}

	getProducts(): Product[] {
		return this.products;
	}

	getProductById(id: string): Product | undefined {
		return this.products.find((product) => product.id === id);
	}
}
