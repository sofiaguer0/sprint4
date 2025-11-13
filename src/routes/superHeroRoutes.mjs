import express from 'express';

import { 
    ObtenerSuperHeroePorIdController, 
    obtenerTodosLosSuperHeroesController, 
    buscarSuperHeroesPorAtributoController, 
    obtenerSuperHeroesMayoresDe30Controller, 
    crearSuperheroeController, 
    actualizarSuperHeroeController, 
    eliminarSuperPorIdController, 
    eliminarSuperPorNombreController, renderDashboardController,  mostrarFormularioAgregarController, mostrarFormularioEditarController
} from '../controllers/superheroesController.mjs';
import { validarCrearSuperHeroe, validarActualizarSuperHeroe, validarId, validarNombre } from '../validation/validationRules.js';
import { handleValidationErrors } from '../validation/errorMiddleware.js';



const router = express.Router();

//tp3
router.get('/dashboard',renderDashboardController);
router.get('/heroes/nuevo', mostrarFormularioAgregarController);
router.get('/heroes/editar/:id', mostrarFormularioEditarController);

// GET
router.get('/heroes', obtenerTodosLosSuperHeroesController);
router.get('/heroes/:id', ObtenerSuperHeroePorIdController);
router.get('/heroes/buscar/:atributo/:valor', buscarSuperHeroesPorAtributoController);
router.get('/heroes/mayor/mayores-30', obtenerSuperHeroesMayoresDe30Controller);

// POST
router.post('/heroes', validarCrearSuperHeroe(), handleValidationErrors, crearSuperheroeController);

// PUT
router.put('/actualizarHeroe/:id', validarActualizarSuperHeroe(), handleValidationErrors, actualizarSuperHeroeController);

// DELETE por id
router.delete('/eliminarSuperID/:id', validarId(), handleValidationErrors, eliminarSuperPorIdController);

// DELETE por nombre
router.delete('/eliminarSuperNombre/:nombreSuperHeroe', validarNombre(), handleValidationErrors, eliminarSuperPorNombreController);

export default router;