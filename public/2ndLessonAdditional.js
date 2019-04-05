class Hamburger {
    constructor(size, stuffing) {
        this.size = size;
        this.stuffing = stuffing;
        this.toppings = [
            { name: 'flavoring', price: 15, calorie: 0, quantity: 0 },
            { name: 'mayonnaise', price: 20, calorie: 5, quantity: 0 }
        ];
    }
    addTopping(topping) {
        for (var i = 0; i < this.toppings.length; i++) {
            if (topping == this.toppings[i].name) {
                this.toppings[i].quantity++;
            }
        }
    }
    removeTopping(topping) {
        for (var i = 0; i < this.toppings.length; i++) {
            if (topping == this.toppings[i].name) {
                this.toppings[i].quantity--;
            }
        }
    }
    getToppings() {
        return this.toppings;
    }
    getSize() {
        return this.size;
    }
    getStuffing() {
        return this.stuffing;
    }
    calculatePrice() {
        var price = 0;
        if (this.size == "Big") {
            price += 100;
        } else if (this.size == 'Small') {
            price += 50;
        }

        if (this.stuffing == 'Cheese') {
            price += 10;
        } else if (this.stuffing == 'Salad') {
            price += 20;
        } else if (this.stuffing == 'Potato') {
            price += 15;
        }
        var toppingsCost = 0;
        for (var i = 0; i < this.toppings.length; i++) {
            toppingsCost += this.toppings[i].price * this.toppings[i].quantity;
        }
        price += toppingsCost;

        this.price = price;
    }
    calculateCalories() {
        var calorie = 0;
        if (this.size == 'Big') {
            calorie += 40;
        } else if (this.size == 'Small') {
            calorie += 20;
        }
        if (this.stuffing == 'Cheese') {
            calorie += 20;
        } else if (this.stuffing == 'Salad') {
            calorie += 5;
        } else if (this.stuffing == 'Potato') {
            calorie += 10;
        }
        var toppingsCalorie = 0;
        for (var i = 0; i < this.toppings.length; i++) {
            toppingsCalorie += this.toppings[i].calorie * this.toppings[i].quantity;
        }
        calorie += toppingsCalorie;

        this.calorie = calorie;
    }
}

// Это наверняка можно было сделать лучше, если не многим сложнее и не отнимет у Вас много времени - подскажите, пожалуйста, хотя бы направление