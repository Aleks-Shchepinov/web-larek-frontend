import { Product } from '../models/ProductModel';
import { EventEmitter } from '../events';
import { CDN_URL } from '../../../utils/constants';
import { BasketModel } from '../models/BasketModel';

export class ProductCard {
	private element: HTMLElement;
	private button: HTMLButtonElement | null;

	constructor(
		templateSelector: string,
		product: Product,
		events: EventEmitter,
		basketModel?: BasketModel
	) {
		const template =
			document.querySelector<HTMLTemplateElement>(templateSelector);
		if (!template) throw new Error(`Шаблон ${templateSelector} не найден`);

		this.element = template.content.firstElementChild!.cloneNode(
			true
		) as HTMLElement;
		this.button = this.element.querySelector('button.card__button');

		this.element.querySelector('.card__title')!.textContent = product.title;
		const imagePath = product.image.startsWith('http')
			? product.image
			: `${CDN_URL}/${product.image}`;
		this.element.querySelector('.card__image')!.setAttribute('src', imagePath);

		const descriptionElement = this.element.querySelector('.card__text');
		if (descriptionElement && product.description) {
			descriptionElement.textContent = product.description;
		}

		const categoryElement = this.element.querySelector('.card__category');
		if (categoryElement) {
			categoryElement.textContent = product.category;
			const categoryClass = this.getCategoryClass(product.category);
			categoryElement.classList.add(`card__category_${categoryClass}`);

			categoryElement.classList.add(
				`card__category_${product.category.toLowerCase()}`
			);
		}

		const priceElement = this.element.querySelector('.card__price')!;
		if (priceElement) {
			priceElement.textContent =
				product.price !== null ? `${product.price} синапсов` : 'Бесценно!';
		}

		if (this.button && product.price === null) {
			this.button.disabled = true;
			this.button.textContent = 'Недоступно';
			this.button.classList.add('button_disabled');
		}

		this.element.addEventListener('click', () => {
			events.emit('product:open', { productId: product.id });
		});

		this.element
			.querySelector('.card__button')
			?.addEventListener('click', (e) => {
				e.stopPropagation();
				if (basketModel?.hasProduct(product.id)) {
					events.emit('cart:remove', { productId: product.id });
				} else {
					events.emit('cart:add', { product });
				}
			});

		this.button = this.element.querySelector('.card__button')!;

		if (basketModel) {
			this.updateButton(basketModel.hasProduct(product.id));
		}
	}

	private getCategoryClass(category: string): string {
		const lowerCategory = category.toLowerCase();

		if (lowerCategory.includes('софт') || lowerCategory.includes('soft')) {
			return 'soft';
		} else if (
			lowerCategory.includes('хард') ||
			lowerCategory.includes('hard')
		) {
			return 'hard';
		} else if (
			lowerCategory.includes('доп') ||
			lowerCategory.includes('additional')
		) {
			return 'additional';
		} else if (
			lowerCategory.includes('кнопк') ||
			lowerCategory.includes('button')
		) {
			return 'button';
		} else {
			return 'other';
		}
	}

	private updateButton(inBasket: boolean) {
		this.button.textContent = inBasket ? 'Убрать' : 'В корзину';
		this.button.classList.toggle('button_alt', inBasket);
	}

	getElement() {
		return this.element;
	}
}
