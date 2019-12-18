var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        res.forEach(function (element) {
            console.log("| Item Id: " + element.item_id + " || Product: " + element.product_name + " || price: " + element.price + " || quantity:" + element.stock_quantity + "|")
        })
        getProdId();
    });
});
function getProdId() {
    inquirer.prompt([{
        name: "whichId",
        type: "input",
        message: "Please input the ID of the product you are purchasing:"
    }
    ]).then(function (answer) {
        var query = "SELECT * FROM products WHERE item_id=" + answer.whichId;
        connection.query(query, function (err, res) {
            if (err) throw err;
            res.forEach(function (element) {
                console.log("Item: " + element.product_name + " || price: " + element.price + " || quantity: " + element.stock_quantity)
            })
            getQuantity(answer.whichId);
        })
    })
}
function getQuantity(itemId) {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer.prompt([{
            name: "quantity",
            type: "input",
            message: "Please input the amount you would like to buy:"
        }]).then(function (answer) {
            for (let i = 0; i < res.length; i++) {
                if (parseInt(res[i].item_id) === parseInt(itemId)) {
                    if (parseInt(res[i].stock_quantity) < parseInt(answer.quantity)) {
                        console.log("out of stock!")
                    }
                    else {
                        var newQuantity = res[i].stock_quantity - answer.quantity;
                        var query = "UPDATE products SET stock_quantity = " + newQuantity + " WHERE item_id = " + parseInt(itemId);
                        connection.query(query, function (err, response) {
                            if (err) throw err;
                            console.log("Total price is: " + parseInt(res[i].price) * answer.quantity)
                        })
                    }
                }
            }
        })
    })
}
