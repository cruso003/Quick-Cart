import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Default route to serve the OpenAPI documentation
app.use('/');

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);    
})