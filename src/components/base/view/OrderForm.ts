import { EventEmitter } from '../events';

export class OrderForm {
	private element: HTMLFormElement;
	private paymentMethod: string = '';
	private address: string = '';
	private onlineButton: HTMLButtonElement;
	private cashButton: HTMLButtonElement;
	private submitButton: HTMLButtonElement;
	private events: EventEmitter;

	constructor(templateSelector: string, events: EventEmitter) {
		const template =
			document.querySelector<HTMLTemplateElement>(templateSelector);
		if (!template) throw new Error('Шаблон формы заказа');

		this.element = template.content.firstElementChild!.cloneNode(
			true
		) as HTMLFormElement;
		this.events = events;

		this.onlineButton = this.element.querySelector(
			'button[name="card"]'
		) as HTMLButtonElement;
		this.cashButton = this.element.querySelector(
			'button[name="cash"]'
		) as HTMLButtonElement;
		this.submitButton = this.element.querySelector(
			'.order__button'
		) as HTMLButtonElement;
		const addressInput = this.element.querySelector(
			'input[name="address"]'
		) as HTMLInputElement;

		this.element.addEventListener('submit', (e) => {
			e.preventDefault();
			if (this.paymentMethod && this.address) {
				this.events.emit('order:submit', {
					paymentMethod: this.paymentMethod,
					address: this.address,
				});
			}
		});

		this.onlineButton.addEventListener('click', () => {
			this.paymentMethod = 'card';

			this.onlineButton.classList.remove('button_alt');
			this.onlineButton.classList.add('button_alt-active');
			this.cashButton.classList.remove('button_alt-active');
			this.cashButton.classList.add('button_alt');
			this.validate();
		});

		this.cashButton.addEventListener('click', () => {
			this.paymentMethod = 'cash';

			this.cashButton.classList.remove('button_alt');
			this.cashButton.classList.add('button_alt-active');
			this.onlineButton.classList.remove('button_alt-active');
			this.onlineButton.classList.add('button_alt');
			this.validate();
		});

		addressInput.addEventListener('input', () => {
			this.address = addressInput.value;
			this.validate();
		});

		this.submitButton.disabled = true;
	}

	private validate() {
		const isValid = this.paymentMethod && this.address.trim().length >= 5;
		this.submitButton.disabled = !isValid;
	}

	getElement(): HTMLElement {
		return this.element;
	}

	getData() {
		return {
			paymentMethod: this.paymentMethod,
			address: this.address.trim(),
		};
	}
}
