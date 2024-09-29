const express = require("express")
const dotenv = require("dotenv");
const cors = require("cors");
const sequelize = require("./src/config/db");
const routerUser = require("./src/routes/User");


const app = express();

const corsOptions = {
    origin:(origin, callback) => {
        callback(null, true);
        console.log(origin)
    },
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'X-Kuma-Revision'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
}


app.use(express.json());
app.use(cors(corsOptions));
app.use('/api/users', routerUser);


dotenv.config();

app.get("/api", (req, res) => {
    res.send("Welcom to TASK#4 API")
});

sequelize.authenticate().then(() => {
    console.log('Conexión establecida exitosamente');
})

const PORT = process.env.PORT_API || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})