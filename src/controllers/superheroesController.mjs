import { obtenerSuperHeroePorId, obtenerTodosLosSuperHeroes, buscarSuperHeroesPorAtributo, obtenerSuperHeroesMayoresDe30, crearSuperHeroe, actualizarSuperHeroe,eliminarSuperHeroePorId, eliminarSuperPorNombre } from "../services/superheroesService.mjs";
import { renderizarSuperHeroe, renderizarListaSuperHeroes } from '../views/responseView.mjs';

export async function ObtenerSuperHeroePorIdController(req, res) {
    try{

        const {id} = req.params;
        const superheroe = await obtenerSuperHeroePorId(id);
        console.log(superheroe);
        if(!superheroe) {
            return res.status(404).send({ mensaje: 'Superhéroe no encontrado, capo!' });
        }

        const superheroeFormateado = renderizarSuperHeroe(superheroe);
        res.status(200).json(superheroeFormateado);

    } catch (error) {
        
        res.status(500).send({ mensaje: 'Error al obtener el superhéroe por ID', error: error.menssage });

    }
}

export async function obtenerTodosLosSuperHeroesController(req, res) {
    
    try{

        const superheroes = await obtenerTodosLosSuperHeroes();
        const superoheroesFormateados = renderizarListaSuperHeroes(superheroes);

        res.status(200).json(superoheroesFormateados);

    } catch (error) {

        res.status(500).send({ mensaje: 'Error al obtener los superhéroes.', error: error.menssage });

    }

}

export async function buscarSuperHeroesPorAtributoController(req, res) {
    
    try {

        const {atributo, valor} = req.params;
        const superheroes = await buscarSuperHeroesPorAtributo(atributo, valor);

        if(superheroes.length === 0) {
            return res.status(404).send({ mensaje: 'No se encontraron superhéroes con ese atributo' });
        }

        const superheroeFormateado = renderizarListaSuperHeroes(superheroes);
        res.status(200).json(superheroeFormateado);


    } catch(error) {

        res.status(500).send({ mensaje: 'Error al buscar los superhéroes por atributo.', error: error.menssage });

    }

}


export async function obtenerSuperHeroesMayoresDe30Controller(req, res) {
    
    try {

        const superheroes = await obtenerSuperHeroesMayoresDe30();
        console.log(superheroes);
        if(superheroes.length === 0) {
            return res.status(404).send({ mensaje: 'No se encontraron superhéroes mayores de 30 años' });
        }

        const superheroeFormateado = renderizarListaSuperHeroes(superheroes);
        res.status(200).json(superheroeFormateado);


    } catch(error){
        res.status(500).send({ mensaje: 'Error al obtener los superhéroes mayores de 30.', error: error.menssage });
    }

}


//CREAR SUPERHEROE 

export async function crearSuperheroeController(req, res) {
    try{

        const {nombreSuperHeroe, nombreReal, edad, planetaOrigen, debilidad, poderes, aliados, enemigos, creador} = req.body;
        const nuevoSuperheroe = {nombreSuperHeroe, nombreReal, edad, planetaOrigen, debilidad, poderes, aliados, enemigos, creador};
        const superheroeCreado = await crearSuperHeroe(nuevoSuperheroe);
        const superheroeFormateado = renderizarSuperHeroe(superheroeCreado);
        res.status(201).json({
            mensaje: 'Superheroe creado correctamente',
            superheroe: superheroeFormateado
        });

    }catch (error){
        res.status(500).send({ mensaje: 'Error al crear el superheroe', error: error.message });
    }
}

// ACTUALIZAR SUPERHEROE

export async function actualizarSuperHeroeController(req, res) {
    try {

        const {id} = req.params;
        const datosActualizados = req.body;

        const superHeroeActualizado = await actualizarSuperHeroe(id, datosActualizados);
        const superheroeFormateado = renderizarSuperHeroe(superHeroeActualizado);

        res.status(200).json({
            mensaje: 'Superhéroe actualizado exitosamente',
            data: superheroeFormateado
        });

    } catch(error) {
        if (error.message === 'Superhéroe no encontrado') {
            return res.status(404).send({ mensaje: error.message });
        }
        res.status(400).send({ 
            mensaje: 'Error al actualizar el superhéroe', 
            error: error.message 
        });
    }
}

// ELIMINAR POR ID

export async function eliminarSuperPorIdController(req, res) {
    try {
        
        const {id} = req.params;

        const superheroeEliminado = await eliminarSuperHeroePorId(id);
        const superheroeFormateado = renderizarSuperHeroe(superheroeEliminado);

        res.status(200).json({
            mensaje: 'Superhéroe eliminado por ID exitosamente',
            data: superheroeFormateado
        });

    } catch (error) {

        /* if (error.message === 'Superhéroe no encontrado') {
            return res.status(404).send({ mensaje: error.message });
        } */
        res.status(500).send({ 
            mensaje: 'Error al eliminar el superhéroe por Id', 
            error: error.message 
        });

    }
}

// ELIMINAR POR NOMBRE

export async function eliminarSuperPorNombreController(req, res) {
    try {
        
        const {nombreSuperHeroe} = req.params;
        const superheroeEliminado = await eliminarSuperPorNombre(nombreSuperHeroe);
        const superheroeFormateado = renderizarSuperHeroe(superheroeEliminado);

        res.status(200).json({
            mensaje: 'Superhéroe eliminado por Nombre exitosamente',
            data: superheroeFormateado
        });

    } catch (error) {
        res.status(500).send({ 
            mensaje: 'Error al eliminar el superhéroe por Nombre', 
            error: error.message 
        });
    }
}


//tp3 

export async function renderDashboardController(req, res) {
    try {
        console.log("🦸 Entrando a renderDashboardController..."); // 👈 prueba de log

        const superheroes = await obtenerTodosLosSuperHeroes();
        console.log("✅ Superheroes obtenidos:", superheroes.length);

        res.render('dashboard', { superheroes });
    } catch (error) {
        console.error('❌ Error al renderizar dashboard:', error);
        res.status(500).send('Error al renderizar la vista');
    }
}


export async function mostrarFormularioAgregarController(req, res) {
    try {
        res.render('addSuperhero');
    } catch (error) {
        res.status(500).send({ mensaje: 'Error al cargar el formulario', error: error.message });
    }
}

export async function mostrarFormularioEditarController(req, res) {
    try {
        const { id } = req.params;
        const superheroe = await obtenerSuperHeroePorId(id);

        if (!superheroe) {
            return res.status(404).send({ mensaje: 'Superhéroe no encontrado' });
        }

        res.render('editSuperhero', { superheroe });
    } catch (error) {
        res.status(500).send({ mensaje: 'Error al cargar el formulario de edición', error: error.message });
    }
}