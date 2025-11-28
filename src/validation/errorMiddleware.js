import { validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    // Log para debug 
    console.log('¿Hay errores?', !errors.isEmpty());
    console.log('Errores encontrados:', errors.array());
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            mensaje: 'Errores de validación',
            errores: errors.array().map(error => ({
                campo: error.path,
                valor: error.value,
                mensaje: error.msg
            }))
        });
    }
    next();
};