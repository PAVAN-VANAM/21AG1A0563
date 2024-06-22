const express = require('express')
const axios = require('axios');
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

// port number
const port  = 3000;

//  root link checking
app.get('/', (req, res) => {
    res.send("Server is listening on port " +port);
})

// calling products :
app.post('/auth', async(req, res) => {
    const {companyName,clientID,clientSecret,ownerName,ownerEmail,rollNo} = req.body;
    const auth = "http://20.244.56.144/test/auth";
    try {
        const response = await axios.post(auth, {
            companyName: companyName,
            clientID: clientID,
            clientSecret: clientSecret,
            ownerName: ownerName,
            ownerEmail: ownerEmail,
            rollNo: rollNo
        });
        const products = response.data; // Assuming the API returns an array of products
        console.log(products);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error : error });
    }
})
app.post('/fetch-products', async (req, res) => {
    const { companyname, categoryname,accessToken, top = 100, minPrice = 1, maxPrice = 10000, page = 1, limit = 10 } = req.body;

    const apiUrl = `http://20.244.56.144/test/companies/${companyname}/categories/${categoryname}/products?top=${top}&minPrice=${minPrice}&maxPrice=${maxPrice}`;

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const products = response.data; //API returns an array of products

        // Pagination logic
        const totalProducts = products.length;
        const totalPages = Math.ceil(totalProducts / limit);

        if (page > totalPages) {
            return res.status(404).json({ error: 'Page not found' });
        }

        const startIndex = (page - 1) * limit;
        const endIndex = Math.min(startIndex + limit, totalProducts);
        const paginatedProducts = products.slice(startIndex, endIndex);

        res.json({
            page: page,
            totalPages: totalPages,
            totalProducts: totalProducts,
            products: paginatedProducts,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(port ,(req,res)=>{
    console.log(`server is running at ${port}`);
})