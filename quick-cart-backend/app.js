import express from 'express';
import cors from 'cors';

import swaggerRoute from './src/routes/swagger.route.js';
import userRoute from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";
import productRoute from "./src/routes/product.route.js";
import storeRoute from "./src/routes/store.route.js";
import categoryRoute from "./src/routes/category.route.js";
import subcategoryRoute from "./src/routes/subcategory.route.js";
import { approveSeller } from './src/controllers/auth.controller.js';

// Initialize Express
const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: process.env.CLIENT_URL, credentials:true }));


// Default route to serve the OpenAPI documentation
app.use('/', swaggerRoute);

// General Routes
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/stores', storeRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/subcategories', subcategoryRoute);
// Use `upload.array()` for multiple images
app.use('/api/products', productRoute);

//Vendor route
app.use('/api/v1/user', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/stores', storeRoute);
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subcategoryRoute);
// Use `upload.array()` for multiple images
app.use('/api/v1/products', productRoute);
app.get('/api/v1/approve-seller/:token', approveSeller
);


// Start the server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
