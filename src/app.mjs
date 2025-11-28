import express from "express";
import { connectDB } from "./config/dbConfig.mjs";
import superHeroRoutes from './routes/superHeroRoutes.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';


const app = express();
const PORT = process.env.PORT || 3005;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Middleware para manejar archivos JSON en las solicitudes;
app.use(express.json());

app.use(methodOverride('_method'));

//conexion con la bd mongo;
connectDB();

//ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// config de la rutas
app.use('/api', superHeroRoutes);

// Manejo de errores para rutas no encontradas
app.use((req, res) => {
    res.status(404).send({mensaje: 'Ruta no encontrada'});
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})