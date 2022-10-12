import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());  // parsing body
app.use(cors());

// app.use(cors({
//     origin: ['http://localhost:3000','https://ecom-25516.web.app', "*"],
//     credentials: true
// }));


const port = process.env.PORT || 5000;


const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: String, required: true },
    code: { type: String, required: true },

    createdOn: { type: Date, default: Date.now }
});

const productModel = mongoose.model('product', productSchema);

// 

app.post("/product", async (req, res) => {

    console.log("product received: ", req.body);

    let newProduct = new productModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        code: req.body.code,
    })
    try {
        let response = await newProduct.save()
        console.log("product added: ", response);

        res.send({
            message: "product added",
            data: response
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to add product"
        });
    }
})

app.get("/products", async (req, res) => {

    try {
        let products = await productModel.find({}).exec();
        console.log("all products: ", products)

        res.status(200).send({
            message: "all products",
            data: products
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to get product"
        });
    }
})

app.get("/product/:id", async (req, res) => {
    try {
        let product = await productModel
            .findOne({ _id: req.params.id })
            .exec();
        console.log("product :", product);

        res.send({
            message: "product",
            data: product
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to get product"
        });

    }
})

app.delete("/product/:id", async (req, res) => {

    console.log("product received: ", req.body);

    try {
        let deleted = await productModel.deleteOne({ _id: req.params.id })
        console.log("product deleted: ", deleted);

        res.send({
            message: "product deleted",
            data: deleted
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to delete product"
        });
    }
})

app.put("/product/:id", async (req,res)=>{
 let body= req.body;

 console.log("data to be edited :", body);

 let update = {}
 if (body.name) update.name = body.name
 if (body.description) update.description = body.description
 if (body.price) update.price = body.price
 if (body.code) update.code = body.code

try{
    let updated = await productModel
    .findOneAndUpdate({ _id: req.params.id }, update,{new:true})
    .exec();

    console.log("product updated: ", updated);

    res.send({
        message: "product updated successfully",
        data: updated
    });
}catch (error) {
    res.status(500).send({
        message: "failed to update product"
    });
}

});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



/////////////////////////////////////////////////////////////////////////////////////////////////
let dbURI = 'mongodb+srv://abc:abc@cluster0.uhv9f8j.mongodb.net/ecommerceDB?retryWrites=true&w=majority';
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////