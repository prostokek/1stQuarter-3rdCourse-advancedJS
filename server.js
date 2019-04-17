const express = require('express'); // подключаем express
const fs = require('fs'); // подключаем работу с файловой системой
const bodyParser = require('body-parser'); // подключаем для post запросов
const moment = require('moment'); // для работы с датами

const app = express(); // он его из vueScript.js берёт (?)

app.use(express.static('./public')); // указываем корневую папку
app.use(bodyParser.json()); // подключаем к app bodyParser, указываем тип данных

app.use(`/cart`, (req, res, next) => { //перехватает любой запрос к /cart до его исполнения
    if(['POST', 'PATCH', 'DELETE'].includes(req.method)) { //у меня только Patch, по идее, зайдёт || чтобы не делать это при загрузке страницы
        
        fs.readFile('./db/stats.json', 'utf-8', (err, stats_data) => {
            if(err) {
                return console.log (err + 'error on stats read');
            }
            let stats = JSON.parse(stats_data);
            if(req.method === 'PATCH') {
                const [, , id] = req.url.split('/'); // первые два элемента массива пропустит, в id запишет число (искомое)
                
                fs.readFile('./db/products.json', 'utf-8', (err, products_data) => {
                    const products = JSON.parse(products_data);
                    const changingProduct = products.find((item) => item.id == id);
                    
                    stats = JSON.parse(stats_data);
                    stats.push({
                        action: 'Изменение количества',
                        name: changingProduct.name,
                        timestamp: moment().format()
                    });
                    stats = JSON.stringify(stats);
                    fs.writeFile('./db/stats.json', stats, (err, data) => {
                        if(err) {
                            console.log (err + 'error on stats write');
                        }
                    })
                });
            }
        })
    };
    next(); // это мы пропускаем запрос далее (к исполнению)
});

app.get('/products', (req, res) => { //request || response //при запросе products происходит следующее
    fs.readFile('./db/products.json', 'utf-8', (err, data) => { //"прочитай файл, ответь в кодировке, сделай это"
        if (err) {
            return console.log(err + 'an error occured');
        }

        res.send(data); // если есть ответ.отправь(полученные данные)
    })
});

app.get('/cart', (req, res) => {
    fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
        if(err) {
            return console.log(err + 'an error occured');
        }

        res.send(data);
    })
})

app.post('/cart', (req, res) => {
    // req.body // приходит (отправляется) с клиента и записывается в body
    fs.readFile('./db/cart.json', 'utf-8', (err, data) => { //"прочитай файл, ответь в кодировке, сделай это"
        if (err) {
            return console.log(err + 'an error occured');
        }
        const cart = JSON.parse(data);

        cart.push(req.body);

        fs.writeFile('./db/cart.json', JSON.stringify(cart), (err, data) => {
            if(err) {
                return console.log(err + 'an error occured');
            }

            res.send(req.body);
        })

        res.send(data); // если есть ответ.отправь(полученные данные)
    })
});

app.patch('/cart/:id', (req, res) => {
    // req.params.id // и есть :id
    //req.body здесь будет просто количество, увеличенное на 1
    debugger
    fs.readFile('./db/cart.json', 'utf-8', (err, data) => { //"прочитай файл, ответь в кодировке, сделай это"
        if (err) {
            return console.log(err + 'an error occured');
        }

        let cart = JSON.parse(data);

        cart = cart.map((item) => {
            if(item.id === +req.params.id) {
                return { ...item, ...req.body }; // item возьмёт quantity из req.body || объекты сольются
            }

            return item;
        })

        fs.writeFile('./db/cart.json', JSON.stringify(cart), (err, data) => {
            if(err) {
                return console.log(err + 'an error occured');
            }

            res.send(cart.find((item) => item.id === +req.params.id));
        });
        // res.send(data); // если есть ответ.отправь(полученные данные)
    });
});


app.listen(3000, () => { // указываем конкретный порт (для прослушивания)
    console.log('server has been started');
}); // ЭТО ДОЛЖНО БЫТЬ В КОНЦЕ