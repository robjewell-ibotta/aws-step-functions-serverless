import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2"; //e.g. "us-east-1"
const ddbClient = new DynamoDBClient({ region: REGION });
const isBookAvailable = (book, quantity) => {
  return (book.quantity - quantity) > 0
}

export const checkInventory = async (event, context) => {
   try {
    console.log('start query')
    const quantity = 1;

    const params = {
      TableName: "bookTable",
      Key: {
        "bookId": { S: "100" },
      },
    };

    const result = await ddbClient.send(new GetItemCommand(params));

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

export const calculateTotal = async (event, context) => {
  return 100;
}
