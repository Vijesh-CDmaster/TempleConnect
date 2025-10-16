
import { MongoClient } from 'mongodb';

declare global {
    var _mongoClientPromise: Promise<MongoClient>;
}

const uri = "mongodb+srv://viju7122006:7122006@templeconnect.bvv7yuk.mongodb.net/?retryWrites=true&w=majority&appName=TempleConnect";
const client = new MongoClient(uri);

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = client.connect();
}

export default clientPromise;
