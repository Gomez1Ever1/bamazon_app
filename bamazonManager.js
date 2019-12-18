var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});
function mainMenu() {
    inquirer.prompt([{
        name: "managerChoices",
        type: "list",
        message: "Choose an Option",
        choices: [
            "-View products for sale-",
            "-View low inventory-",
            "-Add to inventory-",
            "-Add new product-"
        ]
    }]).then(function (answer) {
        connection.connect(function (err) {
            if (err) throw err;
            var query = "SELECT * FROM products";
            connection.query(query, function (err, res) {
                if (err) throw err;
                switch (answer.managerChoices) {
                    case ("-View products for sale-"):
                        res.forEach(function (element) {
                            console.log("| Item Id: " + element.item_id + " || Product: " + element.product_name + " || price: " + element.price + " || quantity:" + element.stock_quantity + "|")
                        })
                        break;
                    case ("-View low inventory-"):
                        const result = res.filter(function (each) {
                            if (each.stock_quantity < 5) {
                                console.log(each)
                            }
                        })
                        break;
                    case ("-Add to inventory-"):
                        inquirer.prompt([{
                            name: "itemId",
                            type: "input",
                            message: "What item would you like to modify?"
                        },
                        {
                            type: "input",
                            name: "newQuantity",
                            message: "How many would you like to add?"
                        }]).then(function (answer) {
                            for (let i = 0; i < res.length; i++) {
                                if (parseInt(answer.itemId) === parseInt(res[i].item_id)) {
                                    var newQuantity = parseInt(res[i].stock_quantity) + parseInt(answer.newQuantity);
                                    console.log(newQuantity)
                                    var query = "UPDATE products SET stock_quantity= " + newQuantity + " WHERE item_id= " + parseInt(answer.itemId);
                                    connection.query(query, function (err, results) {
                                        if (err) throw err;
                                        console.log("| Item Id: " + res[i].item_id + " || Product: " + res[i].product_name + " || price: " + res[i].price + " || quantity:" + res[i].stock_quantity + "|")
                                    })
                                }
                            }
                        })
                        break;
                    case ("-Add new product-"):
                        inquirer.prompt([{
                            type: "input",
                            name: "itemId",
                            message: "Please give your product an ID #: "
                        },
                        {
                            name: "itemName",
                            type: "input",
                            message: "What product are you adding?"
                        },
                        {
                            name: "category",
                            type: "input",
                            message: "What kind of product is this?"
                        },
                        {
                            type: "input",
                            name: "newPrice",
                            message: "What would you like to price this at?"
                        },
                        {
                            type: "input",
                            name: "newQuantity",
                            message: "How many would you like to add?"
                        }]).then(function (answers) {
                            var query = 'INSERT INTO products VALUES (${answers.itemId}, ${answers.itemName}, ${answers.category}, ${answers.newPrice},${answers.newQuantity});'
                            connection.query(query, function (err, response) {
                                if (err) throw err;
                                console.log(response)
                            })
                        })
                        break;
                }
            })
        })
    })
}
mainMenu();