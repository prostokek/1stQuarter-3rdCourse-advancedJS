Vue.component('product', {
    props: ['item'],
    template: `
    <div class="product item_hover_wrap"><img :src="item.pic">
        <p>{{item.name}}<span>{{item.price}}</span></p>
        <div class="item_hover_addToCart">
            <button @click.prevent="addToCartButtonClick(item)" class="addToCart_tablet"><i class="fas fa-shopping-cart"></i>Add to Cart</button>
            <a href="#" class="share"><i class="fas fa-retweet"></i></a>
            <a href="#" class="like"><i class="far fa-heart"></i></a>
        </div>
    </div>`,
    methods: {
        addToCartButtonClick(item) {
            this.$emit('onAddToCartButtonClick', item);
        }
    }
});

Vue.component('catalogue', {
    props: ['query'],
    methods: {
        addToCartButtonClick(item) {
            this.$emit('onaddtocartbuttonclick', item);
        }
    },
    data() {
        return {
            products: [],
        };
    },
    computed: {
        filteredProducts() {
            if(this.query) {
                const regexp = new RegExp(this.query, 'i');
                return this.products.filter((item) => regexp.test(item.name));
              } else {
                return this.products;
              }
        }
    },
    mounted() {
        fetch(`/products`)
            .then((response) => response.json())
            .then((items) => {
                this.products = items;
                // this.filteredProducts = items;
            });
    },
    template: `
    <div class="col-12 p-0 productPage_main_products row" id='productPage_main_products'>
        <product v-for='product in filteredProducts' :item="product" @onAddToCartButtonClick="addToCartButtonClick" class="product item_hover_wrap">     
        </product>
        <div v-if="filteredProducts.length == 0">
            <h2>Ничего не найдено</h2>
        </div> 
    </div>
    `,
    
});

Vue.component('cart-item', {
    props: ['item'],
    methods: {
        removeFromCartButtonClick(item) {
            this.$emit('onRemoveFromCartButtonClick', item);
        }
    },
    template: `
    <section v-if="item.quantity" class="product">
        <div class="productPic">
            <img :src="item.pic">
            <div>
                <h6>{{item.name}}</h6>
                <p><b>Color:</b> {{item.color}}<br><b>Size:</b> XLL</p>
            </div>
        </div>
        <div class="details">
            <p> 
                <span>
                    UNITY PRICE
                </span>
                {{item.price}}
            </p>
            <p>
                <span>
                    QUANTITY
                </span>
                {{item.quantity}}
            </p>
            <p>
                <span>
                    SHIPPING
                </span>
                FREE
            </p>
            <p>
                <span>
                    SUBTOTAL
                </span>
                \${{item.quantity * item.price}}
            </p>
            <p><button class="fas fa-times-circle removeFromCartButton" v-bind:id="item.id" @click.prevent="removeFromCartButtonClick(item)"></button></p>
        </div>
    </section>
    `,
});

Vue.component('cart', {
    methods:  {
        removeFromCartButtonClick(item) {
            this.$emit('onremovefromcartbuttonclick', item);
        }
    },
    data() {
        return {
            cart: [],
        } 
    },
    mounted() {
        fetch(`/cart`)
            .then((response) => response.json)
            .then((items) => {
                this.cart = items;
            });
    },
    template: `                            
    <div id='cart' class="cart containerM">
        <h4 v-if="summaryCartCost !== 0">PRODUCT DETAILS</h4>

        <div class="clearfix"></div>
        <div class="products" id='cart_products'>

            <cart-item v-for="item in cart"></cart-item>

            <h3 v-if="summaryCartCost !== 0"> Общая стоимость товаров в корзине: \${{summaryCartCost}}</h3>
            <h3 v-else>Корзина пуста</h3>
        </div>
    </div>
    `
});

const app = new Vue({
    el: '#app',
    data: {
        cart: [],
        searchQuery: '',
        filterValue: '',
    },
    mounted() {
        fetch(`/cart`)
            .then((response) => response.json())
            .then((items) => {
                this.cart = items;
            });
    },
    computed: {
        summaryCartCost() {
            return this.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        }
    },
    methods: {
        addToCartButtonClick(item) {
            const cartItem = this.cart.find((cartProduct) => cartProduct.id === item.id); // вернуть cartProduct (что-то из массива cart), если id совпадает с id выбранного продукта|| find возвращает cartProduct, если один из id объектов в массиве this.cart совпадает с id выбранного item (объекта из каталога)
            if (cartItem) {
                fetch(`/cart/${item.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity: cartItem.quantity + 1 }),
                })
                    .then((response) => response.json())
                    .then((item) => {
                        const itemIndex = this.cart.findIndex((cartProduct) => cartProduct.id === item.id);
                        Vue.set(this.cart, itemIndex, item); // this.cart[itemIndex].quantity = item.quantity;
                    });
            }
        },
        removeFromCartButtonClick(item) { // параметр item
            const cartItem = this.cart.find((cartProduct) => cartProduct.id === item.id); // при помощи id находим в корзине нужный товар|| 
            if (cartItem && cartItem.quantity !== 0) {
                fetch(`/cart/${item.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity: cartItem.quantity - 1 }), // уменьшаем количество в корзине (на сервере)
                })
                    .then((response) => response.json()) //парсим ответ из json-строки в js-объект
                    .then((item) => { //с полученным объектом работаем
                        const itemIndex = this.cart.findIndex((cartProduct) => cartProduct.id === item.id); //находим в корзине (текущей (лежащей) на сайте (на самой странице), уже взятой с сервера)
                        Vue.set(this.cart, itemIndex, item); // или можно "сказать" "(вот сюда, по этому ключу, положи вот это значение") || // this.cart[itemIndex].quantity = item.quantity; // изменяем количество на то, что на сервере (на количество в полученном объекте) || чтобы страница (нужная часть) сразу была перерисована 
                    });
            }
        },
        search() {
            this.filterValue = this.searchQuery;
            // let regexp = new RegExp(this.searchQuery, 'i');
            // this.filteredProducts = this.products.filter((item) => regexp.test(item.name));
        },

    },
})


// $(document).on("click.bs.dropdown.data-api", ".noclose", function (e) { e.stopPropagation() }); // Корзина не закрывается при клике по ней



                //  else {
                //     fetch(`/cart`, {
                //         method: 'POST',
                //         headers: {
                //             'Content-Type': 'application/json',
                //         },
                //         body: JSON.stringify({ ...item, quantity: 1 })
                //     })
                //         .then((response) => response.json())
                //         .then((item) => {
                //             this.cart.push(item);
                //         });
                // }