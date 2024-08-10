import express from 'express';
import multer from 'multer';
import path from 'path';

import swaggerRoute from './src/routes/swagger.route.js';
import userRoute from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";
import productRoute from "./src/routes/product.route.js";
import storeRoute from "./src/routes/store.route.js";
import categoryRoute from "./src/routes/category.route.js";
import subcategoryRoute from "./src/routes/subcategory.route.js";

// Initialize Express
const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup multer for handling multipart/form-data
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Default route to serve the OpenAPI documentation
app.use('/', swaggerRoute);

// General Routes
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/stores', storeRoute);
app.use('/api/categories',upload.single("image"),categoryRoute);
app.use('/api/subcategories',upload.single("image"),subcategoryRoute);
// Use `upload.array()` for multiple images
app.use('/api/products', upload.array('file', 10), productRoute);

// Start the server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
