// СОЗДАНИЕ ПЕРЕМЕННЫХ

// ____DOM-переменные____

var $cart_products = document.getElementById('cart_products');

var $catalogue = document.getElementById('productPage_main_products');

// /____DOM-переменные____

// /СОЗДАНИЕ ПЕРЕМЕННЫХ

// СОЗДАНИЕ КЛАССОВ

// ____Каталог____
// Предмет в каталоге

class CatalogueItem {
    constructor(id, name, price, color, pic, quantity) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.color = color;
        this.pic = pic;
        this.quantity = quantity;
    }
    render() {
        return `<div class="product item_hover_wrap" id="${this.id}"><img src="${this.pic}" alt="featuredItems_Pic1">
<p>${this.name}<span>$${this.price}</span></p>
<div class="item_hover_addToCart">
<button class="addToCart_tablet"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
<a href="#" class="share"><i class="fas fa-retweet"></i></a><a href="#" class="like"><i class="far fa-heart"></i></a>
</div>

</div>`
    }
}

// /Предмет в каталоге

// Весь каталог

class CatalogueList {
    constructor() {
        this.products = [];
    }
    fetchProducts() {
        this.products = [
            {id: 0, name: 'T-Shirt0', price: 100, color: 'white', pic: 'imgs/productPage_main_pic1.jpg', quantity: 0},
            {id: 1, name: 'T-Shirt1', price: 200, color: 'green', pic: 'imgs/productPage_main_pic2.jpg', quantity: 0},
            {id: 2, name: 'T-Shirt2', price: 300, color: 'red', pic: 'imgs/productPage_main_pic3.jpg', quantity: 0},
            {id: 3, name: 'T-Shirt3', price: 400, color: 'cyan', pic: 'imgs/productPage_main_pic4.jpg', quantity: 0}
        ];
    }
    render() {
        let catalogueHtml = ``;
        this.products.forEach (good => { //для каждого объекта массива products работает функция, принимающая один параметр       (сам объект)
            const product = new CatalogueItem(good.id, good.name, good.price, good.color, good.pic, good.quantity); // создаём продукты на основе массива products
            catalogueHtml += product.render(); // записываем html каждого продукта в catalogueHtml
        })
        $catalogue.innerHTML = catalogueHtml; // вставляем catalogueHtml в каталог
    }
}


// Вызов [отрисовки] каталога
const catalogue = new CatalogueList();
catalogue.fetchProducts();
catalogue.render();
// /Вызов [отрисовки] каталога

// /Весь каталог
// /____Каталог____

// ____Корзина____
// Предмет в корзине

class CartItem extends CatalogueItem {
    render() {
        return `<section class="product" id="${this.id}">
        <div class="productPic">
        <img src="${this.pic}" alt="">
        <div>
            <h6>${this.name}</h6>
            <p><b>Color:</b> ${this.color}<br><b>Size:</b> XLL</p>
        </div>
        </div>
        <div class="details">
        <p>
        <span>
            UNITY PRICE
        </span>
        $${this.price}</p>
        <p>
           <span>
               QUANTITY
           </span>
           ${this.quantity}
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
        $${this.quantity * this.price}
        </p>
        <p><button class="fas fa-times-circle removeFromCartButton"></button></p>
        </div>
        </section>`;
    }
};

// /Предмет в корзине

// Вся корзина

class CartList extends CatalogueList {
    render() {
        let cartHtml = ``;
        this.products.forEach(good => {
            const cartItem = new CartItem(good.id, good.name, good.price, good.color, good.pic, good.quantity);
            cartHtml += cartItem.render();
        })
        cartHtml += this.summaryCost();
        $cart_products.innerHTML = cartHtml;
    }
    summaryCost() {
        var summaryCartCost = 0; 
        for (var i = 0; i < this.products.length; i++) {
            const cartItemCost = this.products[i].price * this.products[i].quantity;
            summaryCartCost += cartItemCost;
        }
        return `<h4>Общая стоимость товаров в корзине: $${summaryCartCost}</h4>`;
    }
}

// Вызов [отрисовки] корзины 
const cartList = new CartList();
cartList.fetchProducts();
cartList.render();
cartList.summaryCost();
// /Вызов [отрисовки] корзины 

// /Вся корзина
// /____Корзина____

// /СОЗДАНИЕ КЛАССОВ

// СОЗДАНИЕ ФУНКЦИЙ

// ____Добавление в корзину из каталога____

$catalogue.addEventListener('click', handleAddToCart_button);

function handleAddToCart_button() { // Искомая функция ()
if (event.target.tagName === 'BUTTON') { // если нажали на кнопку

    var currentProduct_id = +event.target.parentNode.parentNode.id; //id текущего продукта - id кнопки, на которую нажимаем

    if (event.target.classList.contains('addToCart_tablet')) {
        for (var i = 0; i < cartList.products.length; i++) {
            if (cartList.products[currentProduct_id].id == cartList.products[i].id) {
                cartList.products[i].quantity += 1; // увеличиваем количество выбранного товара на 1
            }
        }
    }

    cartList.render();
}
}

// /____Добавление в корзину (из каталога)____

// ____Удаление из корзины____

$cart_products.addEventListener('click', handleRemoveFromCart_button);

function handleRemoveFromCart_button() {
if (event.target.tagName === 'BUTTON') {

    var currentProduct_id = +event.target.parentNode.parentNode.parentNode.id;

    if (event.target.classList.contains('removeFromCartButton') && (cartList.products[currentProduct_id].quantity > 0)) {
        for (var i = 0; i < cartList.products.length; i++) {
            if (cartList.products[currentProduct_id].id == cartList.products[i].id) {
                cartList.products[i].quantity -= 1; // уменьшаем количество выбранного товара на 1
            }
        }
    }

    cartList.render();
}
}

// ____Удаление из корзины____

$(document).on("click.bs.dropdown.data-api", ".noclose", function (e) { e.stopPropagation() }); // Корзина не закрывается при клике по ней

// /СОЗДАНИЕ ФУНКЦИЙ