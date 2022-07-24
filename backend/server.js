const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const {notFound, errorHandler} = require("./middleware/errorHandler");

dotenv.config();
connectDB();
const app = express();

//To accept JSON data since we are taking out data from frontend.
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Home Page');
})

app.use('/api/user', userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started at port ${PORT}`));