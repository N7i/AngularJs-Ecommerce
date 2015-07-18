var express = require('express');
var path = require("path");
var app = express();

app.use(express.urlencoded()); 
app.use(express.json());

var memoryDb = {
    products: [
        {
            title: 'My product',
            pictureUri: 'http://thecatapi.com/api/images/get?format=src&type=gif',
            description: 'My product description',
            price: 50,
            id: 0,
            remaining: 50
        },
        {
            title: 'My product',
            pictureUri: 'http://thecatapi.com/api/images/get?format=src&type=gif',
            description: 'My product description',
            price: 50,
            id: 1,
            remaining: 50
        }
    ]
};

app.get('/products/:pid', function (req, res, next) {
    var products = memoryDb.products,
        pid = parseInt(req.params.pid),
        seekedProduct = null;

    if (isNaN(pid) || pid < 0) {

        res.status = 500;
        return res.json({ error: 'invalid params' });
    }
    
    products.forEach(function (product) {
        if (pid === product.id) {
            seekedProduct = product;
        }
    });

    if (seekedProduct) {
        return res.json(seekedProduct);
    }
    else {
        res.status = 404;
        return res.json({ error: 'product not found' });
    }
});

app.get('/products', function (req, res, next) {
    var products = memoryDb.products;
    return res.json(products);
});


app.use(express.static(path.join(__dirname, "bin")));

var port = process.env.PORT || 8000;
app.listen(port);
console.log('server listening on port ' + port);