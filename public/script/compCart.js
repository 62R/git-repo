Vue.component('cart', {
    data() {
        return {
            cartUrl: '/api/userCart',
            cart: {
                list: [],
                totalPrice: 0,
                totalQuantity: 0
            }
        }
    },
    mounted() {
        this.$parent.getJson(`${this.cartUrl}`)
            .then(data => {
                for (let el of data.list) {
                    this.cart.list.push(el);
                }
                this.cart.totalPrice = data.totalPrice;
                this.cart.totalQuantity = data.totalQuantity;
            })
    },
    methods: {
        remove(cartItem) {
            this.$parent.deleteJson(`${this.cartUrl}/${cartItem['id_product']}`)
                .then(data => {
                    if (data.result === 1) {
                        this.cart.list.splice(this.cart.list.indexOf(cartItem), 1);
                        this.cart.totalQuantity -= cartItem.quantity;
                        this.cart.totalPrice -= cartItem.price * cartItem.quantity;
                    } else {
                        console.log('Failed delete data.')
                    }
                })
        },
        clear() {
            this.$parent.deleteJson(`${this.cartUrl}/all`)
                .then(data => {
                    if (data.result === 1) {
                        this.cart.list = [];
                        this.cart.totalPrice = 0;
                        this.cart.totalQuantity = 0;
                    } else {
                        console.log('Failed delete data.')
                    }
                })
        }
    },
    template: `
            <div class="wrap wrap_page_cart">
                <section class="cart">
                    <h2 class="hidden">Cart</h2>
                    <ul class="cart__list">
                        <cart-item v-for="item of cart.list"
                            :cartItem = "item"
                            :key = "item.id_product"></cart-item>
                    </ul>
                    <div class="cart__button-wrap">
                        <button type="button" class="cart__button cart__button_type_cart-control" @click="clear()">Clear shopping
                            cart</button>
                        <button type="button" class="cart__button cart__button_type_cart-control">Continue
                            shopping</button>
                    </div>
                </section>
                <section class="checkout">
                    <form action="#" class="input-form">
                        <h4 class="input-form__heading">SHIPPING ADRESS</h4>
                        <div class="input-form__wrap input-form__wrap_type_input">
                            <input type="text" class="input-form__input" placeholder="Sity" required>
                            <input type="text" class="input-form__input" placeholder="State" required>
                            <input type="number" class="input-form__input" placeholder="Postcode / Zip" required>
                        </div>
                        <button type="submit" class="input-form__button input-form__button_type_small">GET A
                            QUOTE</button>
                    </form>
                    <div class="checkout-form">
                        <p class="checkout-form__text checkout-form__text_type_sub-name">SUB TOTAL<span
                                class="checkout-form__text checkout-form__text_type_sub-number">\${{cart.totalPrice}}</span></p>
                        <p class="checkout-form__text checkout-form__text_type_grand-name">GRAND TOTAL<span
                                class="checkout-form__text checkout-form__text_type_grand-number">\${{cart.totalPrice}}</span></p>
                        <div class="checkout-form__button-wrap"><button class="checkout-form__button">PROCEED TO
                                CHECKOUT</button></div>
                    </div>
                </section>
            </div>
    
    `
});

Vue.component('cart-item', {
    props: ['cartItem'],
    template: `
        <li class="cart__item">
            <img class="cart__img" :src="cartItem.img" :alt="cartItem.product_name">
            <div class="cart__item-info">
                <h3 class="cart__heading"><a href="product.html" class="cart__link">{{cartItem.product_name}}</a></h3>
                <p class="cart__text">Price: <span
                        class="cart__text-span cart__text-span_type_price">\${{cartItem.price}}</span></p>
                <p class="cart__text">Color: <span
                        class="cart__text-span cart__text-span_type_color">Red</span></p>
                <p class="cart__text">Size: <span
                        class="cart__text-span cart__text-span_type_size">XI</span></p>
                <p class="cart__text">Quantity: <span
                        class="cart__text-span cart__text-span_type_quantity">{{cartItem.quantity}}</span></p>
            </div>
            <button type="button" class="cart__button cart__button_type_remove" @click="$parent.remove(cartItem)"><span
                    class="hidden">Remove
                    product
                    from
                    cart</span><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                    viewBox="0 0 18 18">
                    <path
                        d="M11.2453 9L17.5302 2.71516C17.8285 2.41741 17.9962 2.01336 17.9966 1.59191C17.997 1.17045 17.8299 0.76611 17.5322 0.467833C17.2344 0.169555 16.8304 0.00177586 16.4089 0.00140366C15.9875 0.00103146 15.5831 0.168097 15.2848 0.465848L9 6.75069L2.71516 0.465848C2.41688 0.167571 2.01233 0 1.5905 0C1.16868 0 0.764125 0.167571 0.465848 0.465848C0.167571 0.764125 0 1.16868 0 1.5905C0 2.01233 0.167571 2.41688 0.465848 2.71516L6.75069 9L0.465848 15.2848C0.167571 15.5831 0 15.9877 0 16.4095C0 16.8313 0.167571 17.2359 0.465848 17.5342C0.764125 17.8324 1.16868 18 1.5905 18C2.01233 18 2.41688 17.8324 2.71516 17.5342L9 11.2493L15.2848 17.5342C15.5831 17.8324 15.9877 18 16.4095 18C16.8313 18 17.2359 17.8324 17.5342 17.5342C17.8324 17.2359 18 16.8313 18 16.4095C18 15.9877 17.8324 15.5831 17.5342 15.2848L11.2453 9Z" />
                </svg></button>
        </li>
    `
})