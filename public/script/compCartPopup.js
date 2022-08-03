Vue.component('cart-popup', {
    props: ['buttonClass'],
    data() {
        return {
            cartUrl: '/api/userCart',
            cart: {
                list: [],
                totalPrice: 0,
                totalQuantity: 0
            },
            cartShow: false
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
        addProduct(product) {
            let find = this.cart.list.find(el => el.id_product === product.id_product);
            if (find) {
                this.increaseQuantity(find);
            } else {
                const newCartEl = Object.assign(product, { quantity: 1 });
                this.$parent.postJson(`${this.cartUrl}`, newCartEl)
                    .then(data => {
                        if (data.result === 1) {
                            this.$set(this.cart.list, this.cart.list.length, {});
                            this.$set(this.cart.list.at(-1), 'id_product', newCartEl.id_product);
                            this.$set(this.cart.list.at(-1), 'product_name', newCartEl.product_name);
                            this.$set(this.cart.list.at(-1), 'price', newCartEl.price);
                            this.$set(this.cart.list.at(-1), 'img', newCartEl.img);
                            this.$set(this.cart.list.at(-1), 'quantity', newCartEl.quantity);
                            this.cart.totalQuantity++;
                            this.cart.totalPrice += newCartEl.price;
                        }
                    })
            }
        },
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
        increaseQuantity(cartItem) {
            this.$parent.putJson(`${this.cartUrl}/${cartItem['id_product']}/increase`)
                .then(data => {
                    if (data.result === 1) {
                        const find = this.cart.list.find((el) => el.id_product === cartItem.id_product)
                        find.quantity++;
                        this.cart.totalQuantity++;
                        this.cart.totalPrice += cartItem.price;
                    } else {
                        console.log('Failed writing new data.')
                    }
                })
        },
        reduceQuantity(cartItem) {
            if (cartItem.quantity === 1) {
                this.remove(cartItem);
                return;
            } else {
                this.$parent.putJson(`${this.cartUrl}/${cartItem['id_product']}/reduce`)
                    .then(data => {
                        if (data.result === 1) {
                            cartItem.quantity--;
                            this.cart.totalQuantity--;
                            this.cart.totalPrice -= cartItem.price;
                        } else {
                            console.log('Failed writing new data.')
                        }
                    })
            }
        }
    },
    template: `
    <div class="cart-popup">
        <button @click="cartShow=!cartShow" :class="buttonClass"  class="cart-popup__button">
            <svg width="33" height="29"
            viewBox="0 0 33 29" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M27.199 29C26.5512 28.9738 25.9396 28.6948 25.4952 28.2227C25.0509 27.7506 24.8094 27.1232 24.8225 26.475C24.8356 25.8269 25.1023 25.2097 25.5653 24.7559C26.0283 24.3022 26.6508 24.048 27.2991 24.048C27.9474 24.048 28.5697 24.3022 29.0327 24.7559C29.4957 25.2097 29.7624 25.8269 29.7755 26.475C29.7886 27.1232 29.5471 27.7506 29.1028 28.2227C28.6585 28.6948 28.0468 28.9738 27.399 29H27.199ZM7.75098 26.32C7.75098 25.79 7.90815 25.2718 8.20264 24.8311C8.49712 24.3904 8.91569 24.0469 9.4054 23.844C9.8951 23.6412 10.434 23.5881 10.9539 23.6915C11.4737 23.7949 11.9512 24.0502 12.326 24.425C12.7009 24.7998 12.9562 25.2773 13.0596 25.7972C13.163 26.317 13.1098 26.8559 12.907 27.3456C12.7041 27.8353 12.3606 28.2539 11.9199 28.5483C11.4792 28.8428 10.9611 29 10.431 29C10.0789 29.0003 9.73017 28.9311 9.40479 28.7966C9.0794 28.662 8.78374 28.4646 8.53467 28.2158C8.2856 27.9669 8.08805 27.6713 7.95325 27.3461C7.81844 27.0208 7.74902 26.6721 7.74902 26.32H7.75098ZM11.551 20.686C11.2916 20.6868 11.039 20.6024 10.8322 20.4457C10.6253 20.2891 10.4756 20.0689 10.406 19.819L5.573 2.36401H2.18005C1.86657 2.36401 1.56591 2.23947 1.34424 2.01781C1.12257 1.79614 0.998047 1.49549 0.998047 1.18201C0.998047 0.868519 1.12257 0.567873 1.34424 0.346205C1.56591 0.124537 1.86657 5.81268e-06 2.18005 5.81268e-06H6.46106C6.72055 -0.00080736 6.97309 0.0837201 7.17981 0.240568C7.38653 0.397416 7.53589 0.617884 7.60498 0.868006L12.438 18.323H25.616L29.999 8.27501H15.399C15.2409 8.27961 15.0834 8.25242 14.9359 8.19507C14.7884 8.13771 14.6539 8.05134 14.5404 7.94108C14.4269 7.83082 14.3366 7.69891 14.275 7.55315C14.2134 7.40739 14.1816 7.25075 14.1816 7.0925C14.1816 6.93426 14.2134 6.77762 14.275 6.63186C14.3366 6.4861 14.4269 6.35419 14.5404 6.24393C14.6539 6.13367 14.7884 6.0473 14.9359 5.98994C15.0834 5.93259 15.2409 5.90541 15.399 5.91001H31.812C32.0077 5.90996 32.2003 5.95866 32.3724 6.05172C32.5446 6.14478 32.6908 6.27926 32.798 6.44301C32.9058 6.60729 32.9714 6.79569 32.9889 6.99145C33.0063 7.18721 32.9752 7.38424 32.8981 7.565L27.493 19.977C27.4007 20.1876 27.249 20.3668 27.0565 20.4927C26.864 20.6186 26.6391 20.6858 26.4091 20.686H11.551Z" />
            </svg>
            <span v-show="cart.totalQuantity">{{cart.totalQuantity}}</span>
        </button>    
        <ul class="cart-popup__list" v-show="cartShow">
            <cart-popup-item v-for="item of cart.list" :cartItem = "item" :key="item['id_product']"></cart-popup-item>
            <li class="cart-popup__total-info">
                <a href="cart.html" class="cart-popup__link">Open cart</a>
                <p class="cart-popup__total-price" v-show="cart.list.length">Total: <span>\${{cart.totalPrice}}</span></p>                
                <p class="cart-popup__text" v-show="!cart.list.length">Cart is empty</p>
            </li>            
        </ul>    
    </div>
    `
});

Vue.component('cart-popup-item', {
    props: ['cartItem'],
    template: `
        <li class="cart-popup-item">
            <img class="cart-popup-item__img" :src="cartItem.img">
            <div class="cart-popup-item__content">
                <p class="cart-popup-item__name"><a href="product.html" class="cart-popup-item__link">{{cartItem.product_name}}</a></p>
                <div class="cart-popup-item__quantity-wrap">
                    <button @click="$parent.reduceQuantity(cartItem)" class="cart-popup-item__quantity-btn">
                        <i class="fa-solid fa-minus"></i>
                    </button>    
                    <p class="cart-popup-item__quantity">{{cartItem.quantity}}</p>                    
                    <button @click="$parent.increaseQuantity(cartItem)" class="cart-popup-item__quantity-btn">
                        <i class="fa-solid fa-plus"></i>
                    </button>            
                </div>
                <p class="cart-popup-item__total">\${{cartItem.price*cartItem.quantity}}</p>
                <p class="cart-popup-item__price">\${{cartItem.price}} each</p>
                <button @click="$parent.remove(cartItem)" class="cart-popup-item__remove-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>            
            </div>            
        </li>
    `
})