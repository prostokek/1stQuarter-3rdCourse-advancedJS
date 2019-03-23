// СОЗДАНИЕ ПЕРЕМЕННЫХ

const products = [
        {id: 0, name: 'T-Shirt0', price: 100, color: 'white', pic: 'imgs/productPage_main_pic1.jpg', quantity: 0},
        {id: 1, name: 'T-Shirt1', price: 200, color: 'green', pic: 'imgs/productPage_main_pic2.jpg', quantity: 0},
        {id: 2, name: 'T-Shirt2', price: 300, color: 'red', pic: 'imgs/productPage_main_pic3.jpg', quantity: 0},
        {id: 3, name: 'T-Shirt3', price: 400, color: 'cyan', pic: 'imgs/productPage_main_pic4.jpg', quantity: 0}
];

var cart = products;

// DOM-переменные

var $cart_products = document.getElementById('cart_products');

var $catalogue = document.getElementById('productPage_main_products');

// /DOM-переменные

// /СОЗДАНИЕ ПЕРЕМЕННЫХ

// СОЗДАНИЕ ФУНКЦИЙ

// Создание каталога

const catalogue_renderItem = ({id, name, price, pic}) => `<div class="product item_hover_wrap" id="${id}"><img src="${pic}" alt="featuredItems_Pic1">
<p>${name}<span>$${price}</span></p>
<div class="item_hover_addToCart">
    <button class="addToCart_tablet"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
    <a href="#" class="share"><i class="fas fa-retweet"></i></a><a href="#" class="like"><i class="far fa-heart"></i></a>
</div>

</div>`

const catalogue_renderList = items => {
    const catalogue_itemsHtmls = items.map(catalogue_renderItem).join('');
    $catalogue.innerHTML = catalogue_itemsHtmls;
}

catalogue_renderList(products);

// /Создание каталога

// Рендер корзины

const cart_renderItem = ({id, name, price, color, pic, quantity}) => `<section class="product" id="${id}">
<div class="productPic">
    <img src="${pic}" alt="">
    <div>
        <h6>${name}</h6>
        <p><b>Color:</b> ${color}<br><b>Size:</b> XLL</p>
    </div>
</div>
<div class="details">
    <p>
    <span>
        UNITY PRICE
    </span>
    $${price}</p>
    <p>
       <span>
           QUANTITY
       </span>
       ${quantity}
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
    $${quantity * price}
    </p>
    <p><button class="fas fa-times-circle removeFromCartButton"></button></p>
</div>
</section>`;

const cart_renderList = items => {
    const cart_itemsHtmls = items.map(cart_renderItem).join('');
    $cart_products.innerHTML = cart_itemsHtmls; // products in cart
}

cart_renderList(cart);

// /Рендер корзины

// Добавление в корзину из каталога

$catalogue.addEventListener('click', handleAddToCart_button);

function handleAddToCart_button() { // Искомая функция ()
    if (event.target.tagName === 'BUTTON') { // если нажали на кнопку

        var currentProduct_id = +event.target.parentNode.parentNode.id; //id текущего продукта - id кнопки, на которую нажимаем

        if (event.target.classList.contains('addToCart_tablet')) {
            for (var i = 0; i < cart.length; i++) {
                if (products[currentProduct_id].id == cart[i].id) {
                    cart[i].quantity += 1; // увеличиваем количество выбранного товара на 1
                }
            }
        }

        cart_renderList(cart);
    }
}

// /Добавление в корзину (из каталога)

// Удаление из корзины

$cart_products.addEventListener('click', handleRemoveFromCart_button);

function handleRemoveFromCart_button() {
    if (event.target.tagName === 'BUTTON') {

        var currentProduct_id = +event.target.parentNode.parentNode.parentNode.id;

        if (event.target.classList.contains('removeFromCartButton') && (products[currentProduct_id].quantity > 0)) {
            for (var i = 0; i < cart.length; i++) {
                if (products[currentProduct_id].id == cart[i].id) {
                    cart[i].quantity -= 1; // уменьшаем количество выбранного товара на 1
                }
            }
        }
        cart_renderList(cart);
    }
}

// Удаление из корзины

$(document).on("click.bs.dropdown.data-api", ".noclose", function (e) { e.stopPropagation() }); // Корзина не закрывается при клике по ней

// /СОЗДАНИЕ ФУНКЦИЙ