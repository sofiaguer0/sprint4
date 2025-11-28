import express from "express";
import { connectDB } from "./config/dbConfig.mjs";
import superHeroRoutes from './routes/superHeroRoutes.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import expressLayouts from 'express-ejs-layouts';


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
//plantilla
app.set('views', path.resolve('./views'));


app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));




//SPRINTTT 4
//express layouts
app.use(expressLayouts);
app.set('layout' , 'layout'); //archivo base

//servir archivos estaticos
app.use(express.static(path.resolve('./public')));


//ruta principal
app.get('/', (req, res) => {
    res.render('index', { title: 'Pagina Principal' });
});

//ruta acerca de
app.get('/about', (req, res) => {
    res.render('about', { title: 'Acerca de Nosotros' });
});

// ruta contacto
app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contactanos' });
});



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