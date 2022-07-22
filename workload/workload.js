const { MongoClient } = require("mongodb");

const uri = process.env.ATLAS_WORKLOAD_URI;

const client = new MongoClient(uri);
console.log("Getting client...")
async function run() {
    try {
        console.log("In run()..")
        await client.connect();
        console.log("Connected")

        const database = client.db('test');
        const movies = database.collection('movies');
        const foods = database.collection('foods')

        while (true) {
            const doc = { name: "Neapolitan pizza", shape: "round" };
            await foods.insertOne(doc);
            const doc2 = { title: 'Back to the Future', year: 1985 }
            await movies.insertOne(doc2)

            const query = { title: 'Back to the Future' };
            const movie = await movies.findOne(query);
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);
