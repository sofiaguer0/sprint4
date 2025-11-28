import { body, param } from 'express-validator';

// Validaciones para crear 
export const validarCrearSuperHeroe = () => [
    body('nombreSuperHeroe')
        .trim()
        .notEmpty().withMessage('El nombre del superhéroe es requerido')
        .isLength({ min: 3, max: 60 }).withMessage('El nombre del superhéroe debe tener entre 3 y 60 caracteres'),
    
    body('nombreReal')
        .trim()
        .notEmpty().withMessage('El nombre real es requerido')
        .isLength({ min: 3, max: 60 }).withMessage('El nombre real debe tener entre 3 y 60 caracteres'),
    
    body('edad')
        .notEmpty().withMessage('La edad es requerida')
        .isInt({ min: 0 }).withMessage('La edad debe ser un número entero no negativo')
        .toInt(),
    
    body('poderes')
        .isArray({ min: 1 }).withMessage('Los poderes deben ser un array con al menos un elemento'),
    
    body('poderes.*')
        .trim()
        .notEmpty().withMessage('Los poderes no pueden estar vacíos')
        .isLength({ min: 3, max: 60 }).withMessage('Cada poder debe tener entre 3 y 60 caracteres'),
    

        //sanitizacion de datos
    body('planetaOrigen')
        .optional()
        .trim(),
    
    body('debilidad')
        .optional()
        .trim(),
    
    body('aliados')  
        .optional()
        .isArray().withMessage('Los aliados deben ser un array'),
    
    body('aliados.*') 
        .optional()
        .trim(),
    
    body('enemigos')  
        .optional()
        .isArray().withMessage('Los enemigos deben ser un array'),
    
    body('enemigos.*') 
        .optional()
        .trim(),
    
    body('creador')
        .optional()
        .trim()
];

// Validaciones para actualizar 
export const validarActualizarSuperHeroe = () => [ 
    param('id')
        .notEmpty().withMessage('El ID es requerido'),
    
    body('nombreSuperHeroe')
        .optional()
        .trim()
        .isLength({ min: 3, max: 60 }).withMessage('El nombre del superhéroe debe tener entre 3 y 60 caracteres'),
    
    body('nombreReal')
        .optional()
        .trim()
        .isLength({ min: 3, max: 60 }).withMessage('El nombre real debe tener entre 3 y 60 caracteres'),
    
    body('edad')
        .optional()
        .isInt({ min: 0 }).withMessage('La edad debe ser un número entero no negativo')
        .toInt(),
    
    body('poderes')
        .optional()
        .isArray({ min: 1 }).withMessage('Los poderes deben ser un array con al menos un elemento'),
    
    body('poderes.*')
        .optional()
        .trim()
        .isLength({ min: 3, max: 60 }).withMessage('Cada poder debe tener entre 3 y 60 caracteres')
];

// Validaciones para ID
export const validarId = () => [ 
    param('id')
        .notEmpty().withMessage('El ID es requerido')
];

// Validaciones para nombre
export const validarNombre = () => [  
    param('nombreSuperHeroe')
        .trim()
        .notEmpty().withMessage('El nombre del superhéroe es requerido')
        .isLength({ min: 3, max: 60 }).withMessage('El nombre debe tener entre 3 y 60 caracteres')
];