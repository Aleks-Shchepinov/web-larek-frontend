import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/base/view/Modal';
import { Api } from './components/base/api';
import { ProductModel } from './components/base/models/ProductModel';
import { BasketModel } from './components/base/models/BasketModel';
import { BasketModal } from './components/base/view/BasketModal';
import { ProductCard } from './components/base/view/ProductCard';
import { API_URL } from './utils/constants';
import { OrderModel } from './components/base/models/OrderModel';
import { OrderForm } from './components/base/view/OrderForm';
import { ContactForm } from './components/base/view/ContactForm';
import { Product } from './components/base/models/ProductModel';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();
const api = new Api(API_URL);
const productModel = new ProductModel(api);
const basketModel = new BasketModel();
const orderModel = new OrderModel(basketModel);

(async () => {
	await productModel.loadProducts();

	const products = productModel.getProducts();

	const gallery = document.querySelector('.gallery');
	if (!gallery) {
		console.error('Контейнер .gallery не найден');
	} else {
		products.forEach((product) => {
			const card = new ProductCard('#card-catalog', product, events);
			gallery.append(card.getElement());
		});
	}

	const modal = new Modal('#modal-container', events);

	events.on<{ productId: string }>('product:open', ({ productId }) => {
		const product = productModel.getProductById(productId);
		if (product) {
			const productCard = new ProductCard(
				'#card-preview',
				product,
				events,
				basketModel
			);
			modal.open(productCard.getElement());
		}
	});

	events.on('order:open', () => {
		if (basketModel.getCount() === 0) return;

		const orderForm = new OrderForm('#order', events);
		modal.open(orderForm.getElement());
	});

	events.on('cart:open', () => {
		const basketView = new BasketModal('#basket', basketModel, events);
		modal.open(basketView.getElement());
	});

	events.on('cart:add', ({ product }: { product: Product }) => {
		if (product.price === null) return;

		basketModel.addToCart({
			id: product.id,
			title: product.title,
			price: product.price,
		});
		events.emit('cart:update');
	});

	events.on('cart:remove', ({ productId }: { productId: string }) => {
		basketModel.removeFromCart(productId);
		events.emit('cart:update');
	});

	events.on('cart:update', () => {
		const counter = document.querySelector('.header__basket-counter');
		if (counter) {
			counter.textContent = basketModel.getCount().toString();
		}

		if (document.querySelector('.basket')) {
			const basketView = new BasketModal('#basket', basketModel, events);
			modal.open(basketView.getElement());
		}
	});

	const cartButton = document.querySelector('.header__basket');
	if (cartButton) {
		cartButton.addEventListener('click', (e) => {
			e.preventDefault();
			events.emit('cart:open');
		});
	}

	function showSuccessModal(totalPrice: number) {
		const successTemplate = document.querySelector(
			'#success'
		) as HTMLTemplateElement;
		const successElement = cloneTemplate(successTemplate);

		successElement.querySelector(
			'.order-success__description'
		)!.textContent = `Списано ${totalPrice} синапсов`;

		successElement
			.querySelector('.order-success__close')!
			.addEventListener('click', () => {
				modal.close();
			});

		modal.open(successElement);
	}

	function updateBasketCounter() {
		const counter = document.querySelector('.header__basket-counter');
		if (counter) {
			counter.textContent = basketModel.getCount().toString();
		}
	}

	events.on(
		'order:submit',
		(data: { paymentMethod: string; address: string }) => {
			const totalPrice = basketModel.getTotalPrice();

			orderModel.setOrderData(data);

			const contactForm = new ContactForm('#contacts', (contactData) => {
				orderModel.setOrderData(contactData);

				showSuccessModal(totalPrice);

				basketModel.clearCart();
				updateBasketCounter();
			});

			modal.open(contactForm.getElement());
		}
	);
})();
