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

        addToCartButtonClick(item) { // параметр item
                const cartItem = this.cart.find((cartProduct) => cartProduct.id === item.id); // вернуть cartProduct (что-то из массива cart), если id совпадает с id выбранного продукта|| find возвращает cartProduct, если один из id объектов в массиве this.cart совпадает с id выбранного item (объекта из каталога)
                if(cartItem) {
                    fetch(`/cart/${item.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ quantity: cartItem.quantity + 1}),
                    })
                        .then((response) => response.json())
                        .then((item) => {
                            // console.log(item.id);
                          const itemIndex = this.cart.findIndex((cartProduct) => cartProduct.id === item.id);
                          this.cart[itemIndex].quantity = item.quantity;
                      });
                }
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
        },
        removeFromCartButtonClick(item) { // параметр item
            const cartItem = this.cart.find((cartProduct) => cartProduct.id === item.id); // при помощи id находим в корзине нужный товар|| 
            if(cartItem && cartItem.quantity !== 0) {
                fetch(`/cart/${item.id}`, {
                    method: 'PATCH',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity: cartItem.quantity - 1}), // уменьшаем количество в корзине (на сервере)
                })
                    .then((response) => response.json()) //парсим ответ из json-строки в js-объект
                    .then((item) => { //с полученным объектом работаем
                        const itemIndex = this.cart.findIndex((cartProduct) => cartProduct.id === item.id); //находим в корзине (текущей (лежащей) на сайте (на самой странице), уже взятой с сервера)
                        // this.cart[itemIndex].quantity = item.quantity; // изменяем количество на то, что на сервере (на количество в полученном объекте) || чтобы страница (нужная часть) сразу была перерисована 
                        Vue.set(this.cart, itemIndex, item); // или можно "сказать" "(вот сюда, по этому ключу, положи вот это значение")
                    });
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
        });
        this.sendRequest(`/cart`).then((items) => {
            this.cart = items;
        });
    },
    computed: {
        summaryCartCost() {
            return this.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
    }
})


// $(document).on("click.bs.dropdown.data-api", ".noclose", function (e) { e.stopPropagation() }); // Корзина не закрывается при клике по ней