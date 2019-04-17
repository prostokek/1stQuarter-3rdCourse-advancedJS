const fs = require('fs'); // подключаем модуль, который хотим подключить. fs -- встроенный модуль (файловой системы).

fs.readFile(`./db/db.json/products`, 'utf-8', (err, data) => {// -- первый параметр -- путь к файлу; второй -- кодировка (в которой мы хотим увидеть результат) третий -- функция callback (файл прочитан -- она срабатывает) (-- в ней: первый параметр -- под ошибку при попытке прочтения файла, второй -- те самые данные)
    if(err) {
        console.log(err);
        return;
    }


    const products = JSON.parse(data);
    console.log(products);
    // products.push({ id: 4, name: 'ay' })
});