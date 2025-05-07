export class ContactForm {
	private form: HTMLFormElement;
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private submitButton: HTMLButtonElement;

	constructor(
		templateSelector: string,
		private callback: (data: { email: string; phone: string }) => void
	) {
		const template = document.querySelector(
			templateSelector
		) as HTMLTemplateElement;
		if (!template) throw new Error(`Template ${templateSelector} not found`);

		this.form = template.content.cloneNode(true) as HTMLFormElement;

		this.emailInput = this.form.querySelector(
			'input[name="email"]'
		) as HTMLInputElement;
		this.phoneInput = this.form.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement;
		this.submitButton = this.form.querySelector(
			'.modal__actions button'
		) as HTMLButtonElement;

		if (!this.emailInput || !this.phoneInput || !this.submitButton) {
			throw new Error('One or more form elements not found');
		}

		this.submitButton.disabled = true;

		this.emailInput.addEventListener('input', () => this.validate());
		this.phoneInput.addEventListener('input', () => this.validate());
		this.submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			if (this.isValid()) {
				this.callback({
					email: this.emailInput.value.trim(),
					phone: this.phoneInput.value.trim(),
				});
			}
		});
	}

	private validate(): void {
		const emailValid = this.emailInput.value.includes('@');
		const phoneValid = this.phoneInput.value.length > 0;
		this.submitButton.disabled = !(emailValid && phoneValid);
	}

	private isValid(): boolean {
		return !this.submitButton.disabled;
	}

	getElement(): HTMLElement {
		return this.form;
	}
}
