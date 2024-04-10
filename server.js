require("dotenv").config();
const express = require('express');
const app = express();
const authRoute = require('./router/auth-router');
const taskRoute = require('./router/task-router');
const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");
const cors = require("cors");

const corsOptions = {
    origin: "https://promanagefrontend.vercel.app",
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());


app.use('/api/auth', authRoute);
app.use('/api/task', taskRoute);

app.use(errorMiddleware);

const PORT = process.env.PORT;

connectDb().then(() =>{
    app.listen(PORT, () =>{
        console.log(`server is running at port : ${PORT}`);
    });
})
