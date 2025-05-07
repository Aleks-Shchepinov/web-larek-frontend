import { BasketItem, BasketModel } from '../models/BasketModel';
import { cloneTemplate } from '../../../utils/utils';
import { EventEmitter } from '../events';

export class BasketModal {
	private element: HTMLElement;
	private listElement: HTMLElement;
	private priceElement: HTMLElement;
	private submitButton: HTMLButtonElement;

	constructor(
		templateSelector: string,
		private basketModel: BasketModel,
		private events: EventEmitter
	) {
		const template =
			document.querySelector<HTMLTemplateElement>(templateSelector);
		if (!template) throw new Error('Template not found');

		this.element = cloneTemplate<HTMLElement>(template);
		this.listElement = this.element.querySelector('.basket__list')!;
		this.priceElement = this.element.querySelector('.basket__price')!;
		this.submitButton = this.element.querySelector('.basket__button')!;

		this.render();
		this.setupListeners();
	}

	private setupListeners() {
		this.listElement.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;
			if (target.classList.contains('basket__item-delete')) {
				const item = target.closest('.basket__item') as HTMLElement;
				const id = item?.dataset?.id;
				if (id) {
					this.events.emit('cart:remove', { productId: id });
				}
			}
		});

		this.submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			if (this.basketModel.getCount() > 0) {
				this.events.emit('order:open');
			}
		});
	}

	private render() {
		this.listElement.innerHTML = '';
		const items = this.basketModel.getCartItems();

		if (items.length === 0) {
			const emptyMessage = document.createElement('p');
			emptyMessage.textContent = 'Корзина пуста';
			this.listElement.appendChild(emptyMessage);
			this.submitButton.disabled = true;
		} else {
			items.forEach((item, index) => {
				const itemElement = this.createBasketItem(item, index + 1);
				this.listElement.appendChild(itemElement);
			});
			this.submitButton.disabled = false;
		}

		this.priceElement.textContent = `${this.basketModel.getTotalPrice()} синапсов`;
	}

	private createBasketItem(item: BasketItem, index: number): HTMLElement {
		const template = document.querySelector(
			'#card-basket'
		) as HTMLTemplateElement;
		const element = template.content.firstElementChild!.cloneNode(
			true
		) as HTMLElement;

		element.dataset.id = item.id;
		element.querySelector('.basket__item-index')!.textContent = String(index);
		element.querySelector('.card__title')!.textContent = item.title;
		element.querySelector(
			'.card__price'
		)!.textContent = `${item.price} синапсов`;

		return element;
	}

	getElement(): HTMLElement {
		return this.element;
	}
}
