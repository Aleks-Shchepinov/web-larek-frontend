import { EventEmitter } from '../events';
import { ensureElement } from '../../../utils/utils';

export class Modal {
	private element: HTMLElement;
	private closeButton: HTMLElement;
	private events: EventEmitter;

	constructor(selector: string, events: EventEmitter) {
		this.element = ensureElement<HTMLElement>(selector);
		this.closeButton = ensureElement<HTMLElement>(
			'.modal__close',
			this.element
		);
		this.events = events;

		this.closeButton.addEventListener('click', () => this.close());
		this.element.addEventListener('click', (e) => {
			if (e.target === this.element) {
				this.close();
			}
		});
	}

	open(content?: HTMLElement) {
		if (content) {
			const body = ensureElement<HTMLElement>('.modal__content', this.element);
			body.innerHTML = '';
			body.append(content);
		}
		this.element.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.element.classList.remove('modal_active');
		this.events.emit('modal:close');
	}
}
