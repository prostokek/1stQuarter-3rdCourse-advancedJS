const app = new Vue({
    el: '#app',
    data: {
        products: [],
        filteredProducts: [],
        cart: [],
        searchQuery: ''
    },
    methods: {
        sendRequest(url) {
            return fetch(url).then((response) => response.json());
        },

        addToCartButtonClick() {
                let currentProduct_id = +event.target.id; //id текущего продукта - id кнопки, на которую нажимаем
    
                    for (let i = 0; i < app.products.length; i++) {
                        if (currentProduct_id === app.products[i].id) {
                            app.cart[i].quantity++; // увеличиваем количество выбранного товара на 1
                        }
                    } // Почему quantity изменяется и у products????
        },
        removeFromCartButtonClick() {
            let currentProduct_id = +event.target.id;

            for (let i = 0; i < app.cart.length; i++) {
                if(currentProduct_id === app.cart[i].id) {
                    app.cart[i].quantity--;
                }
            }
        },

        search() {
            let regexp = new RegExp(this.searchQuery, 'i');
            this.filteredProducts = this.products.filter((item) => regexp.test(item.name));
        },

    },
    mounted() {
        // alert('Mounted');
        this.sendRequest(`/products`).then((items) => { // В скобках же мы обзываем результат resolve. Здесь мы решили звать его items. Далее просто его используем
            this.products = items;
            this.filteredProducts = items;
            this.cart = items;
        })
    },
    computed: {
        summaryCartCost() {
            return this.products.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
    }
})


// $(document).on("click.bs.dropdown.data-api", ".noclose", function (e) { e.stopPropagation() }); // Корзина не закрывается при клике по ней