# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Проектная работа "Web-larёk" 
- это простой онлайн магазин в котором пользователи могут открыть отдельно кажду карточку товара и прочитать подробнее о самом товаре.
- Могут добавить товар в корзину и после чего оплатить в 2 этапа.

## Основные компоненты

### 1. Модель товаров (`ProductModel.ts`)

- Работает с товарами магазина.

```typescript
const productModel = new ProductModel(api);

// Загрузка товаров
await productModel.loadProducts();

// Получить все товары
const products = productModel.getProducts();

// Найти товар по ID
const product = productModel.getProductById('123');
```

### 2. Корзина покупок (BasketModel.ts)

- Хранит товары, которые пользователь хочет купить.

```typescript
const basket = new BasketModel();

// Добавить товар
basket.addToCart(product);

// Удалить товар
basket.removeFromCart('123');

// Получить список товаров
const items = basket.getCartItems();

// Общая стоимость
const total = basket.getTotalPrice();
```

### 3. Заказы (OrderModel.ts)

- Оформление заказов.

```typescript
const orderModel = new OrderModel(basketModel);

// Сохранить данные заказа
orderModel.setOrderData({
  paymentMethod: 'card',
  address: 'Москва'
});

// Завершить заказ
orderModel.completeOrder();
```

### 4. Карточка товара (ProductCard.ts)

- Показывает открытую карточку товара в магазине.

Пример использования:
```typescript
const card = new ProductCard('#product-template', product, events, basketModel);
document.body.appendChild(card.getElement());
```

### 5. Окно корзины (BasketModal.ts)

- Показывает товары в корзине.

Пример использования:
```typescript
const basketModal = new BasketModal('#basket', basketModel, events);
document.body.appendChild(basketModal.getElement());
```

### 6. Форма заказа (OrderForm.ts)

- Форма для оформления заказа.

Пример использования:
```typescript
const orderForm = new OrderForm('#order-template', events);
document.body.appendChild(orderForm.getElement());
```

### 7. Форма контактов (ContactForm.ts)

- Форма для ввода контактных данных.

Пример использования:
```typescript
const contactForm = new ContactForm('#contact-template', (data) => {
  console.log('Контактные данные:', data);
});
document.body.appendChild(contactForm.getElement());
```

### 8. Модальное окно (Modal.ts)

- Базовое всплывающее окно.

Пример использования:
```typescript
const modal = new Modal('#modal-template', events);

// Открыть окно
modal.open();

// Закрыть окно
modal.close();
```

## Как это работает
1. Загружаются товары (`ProductModel`)
2. Показываются карточки товаров (`ProductCard`)
3. Пользователь добавляет товары в корзину (`BasketModel`)
4. При оформлении заказа открывается форма (`OrderForm`)
5. После заполнения данных заказ сохраняется (`OrderModel`)