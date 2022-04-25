'use strict';
const AWS = require("aws-sdk");
const DynamoDB = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-2'
});

const isBookAvailable = (book, quantity) => {
  return (book.quantity - quantity) > 0
}

module.exports.checkInventory = async (bookId, quantity) => {
  try {
    console.log('start query')
    const result = await DynamoDB
      .get({
        TableName: "bookTable",
        Key: { bookId: '100' },
      })
      .promise();

    console.log('end query')

    console.log('result', result)
    console.log('item', result.Item)
    const book = result.Item;


    if (isBookAvailable(book, quantity)) {
      return book;
    } else {
      let bookOutOfStockError = new Error("The book is out of stock")
      bookOutOfStockError.name = "BookOutOfStock";
      throw bookOutOfStockError;
    }

  } catch(error) {
    if (error.name === 'BookOutOfStock') {
      throw error;
    } else {
      let bookNotFoundError = new Error(error);
      bookNotFoundError.name = 'BookNotFound';
      throw bookNotFoundError;
    }
  }
};

module.exports.calculateTotal = async (event) => {
  return 100;
};

