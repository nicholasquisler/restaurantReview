require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require("./db");
const path = require("path");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Get all Restaurants
app.get('/api/v1/restaurants', async (req, res) => {
    try {
        const results = await db.query(
            "SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating),1) AS average_rating FROM reviews GROUP BY restaurant_id) reviews ON restaurants.id = reviews.restaurant_id ORDER BY id ASC;"
        );
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                restaurants: results.rows
            }
        });
    } catch (err) {
        console.log(err);
    }
});

// Get a Restaurant
app.get('/api/v1/restaurants/:id', async (req, res) => {
    try {
        const results_restaurant = await db.query(
            "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1",
            [req.params.id]
        );
        const results_reviews = await db.query(
            `SELECT * FROM reviews WHERE restaurant_id = $1`,
            [req.params.id]
        );
        res.status(200).json({
            status: "success",
            data: {
                restaurant: results_restaurant.rows[0],
                reviews: results_reviews.rows
            }
        });
    } catch (err) {
        console.log(err);
    }
});

// Create a Restaurant
app.post('/api/v1/restaurants', async (req, res) => {
    try {
        const results = await db.query(
            "INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) RETURNING *",
            [req.body.name, req.body.location, req.body.price_range]
        );
        res.status(201).json({
            status: "success",
            data: {
                restaurant: results.rows[0]
            }
        });
    } catch (err) {
        console.log(err);
    }
});

// Update Restaurants
app.put('/api/v1/restaurants/:id', async (req, res) => {
    try {
        const results = await db.query(
            "UPDATE restaurants SET name = $1, location = $2, price_range= $3 WHERE id = $4 RETURNING *",
            [req.body.name, req.body.location, req.body.price_range, req.params.id]
        );
        res.status(200).json({
            status: "success",
            data: {
                restaurant: results.rows[0]
            }
        });
    } catch (err) {
        console.log(err);
    }
});

// Delete Restaurant
app.delete('/api/v1/restaurants/:id', async (req, res) => {
    try {
        const results = await db.query(
            "DELETE FROM restaurants WHERE id = $1 RETURNING *",
            [req.params.id]
        );
        res.status(204).json({
            status: "success"
        });
    } catch (err) {
        console.log(err);
    }
});

// Add Review
app.post('/api/v1/restaurants/:id/addReview', async (req, res) => {
    try {
        const results = await db.query(
            "INSERT INTO reviews (restaurant_id, name, review, rating) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.params.id, req.body.name, req.body.review, req.body.rating]
        );
        res.status(201).json({
            status: 'success',
            data: {
                review: results.rows[0]
            }
        });
    } catch (err) {
        console.log(err);
    }
})

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '/../client/build/')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '/../client/build/index.html')) // relative path
    });
}

const port = process.env.PORT;
app.listen(port || 5000, () => {
    console.log(`Server is listening on port ${port}.`);
});