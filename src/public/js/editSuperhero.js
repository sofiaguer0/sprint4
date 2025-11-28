let contadoresArray = {
    poderes: 0,
    aliados: 0,
    enemigos: 0
};

const superhero = window.superheroe;
const id = superhero._id;

// Agregar items a arrays
function añadirItem(tipo, valor = '') {
    const contenedor = document.getElementById(`${tipo}Contenedor`);
    const idItem = contadoresArray[tipo]++;
            
    const div = document.createElement('div');
    div.className = 'array-input-grupo';
    div.id = `${tipo}-${idItem}`;
            
    div.innerHTML = `
        <input 
            type="text" 
            name="${tipo}[]"
            value="${valor}"
        >
        <button type="button" class="boton-remover" onclick="quitarItem('${tipo}', ${idItem})">
            Eliminar
        </button>
    `;
            
    contenedor.appendChild(div);
}

// Eliminar items de arrays
function quitarItem(tipo, idItem) {
    const contenedorAux = document.getElementById(`${tipo}Contenedor`);
    const itemsAux = contenedorAux.querySelectorAll('.array-input-grupo');

    if(tipo === 'poderes' && itemsAux.length === 1){
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: 'Debe haber al menos un poder'
        });
        return;
    }

    const element = document.getElementById(`${tipo}-${idItem}`);
    if (element) {
        element.remove();
    }
}

function inicializarArrays(){
    if(superhero.poderes && superhero.poderes.length > 0){
        superhero.poderes.forEach(poder => {
            añadirItem('poderes', poder);
        });
    } else {
        añadirItem('poderes', '');
    }

    if(superhero.aliados && superhero.aliados.length > 0){
        superhero.aliados.forEach(aliado => {
            añadirItem('aliados', aliado);
        });
    }

    if(superhero.enemigos && superhero.enemigos.length > 0){
        superhero.enemigos.forEach(enemigo => {
            añadirItem('enemigos', enemigo);
        });
    }
}

// Manejar envío del formulario (SIN VALIDACIÓN EN FRONTEND)
document.getElementById('superheroeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const superheroe = {
        nombreSuperHeroe: document.getElementById('nombreSuperHeroe').value.trim(),
        nombreReal: document.getElementById('nombreReal').value.trim(),
        edad: parseInt(document.getElementById('edad').value),
        planetaOrigen: document.getElementById('planetaOrigen').value.trim(),
        debilidad: document.getElementById('debilidad').value.trim(),
        creador: document.getElementById('creador').value.trim(),
        poderes: [],
        aliados: [],
        enemigos: []
    };

    document.querySelectorAll('input[name="poderes[]"]').forEach(input => {
        if (input.value.trim()) {
            superheroe.poderes.push(input.value.trim());
        }
    });

    document.querySelectorAll('input[name="aliados[]"]').forEach(input => {
        if (input.value.trim()) {
            superheroe.aliados.push(input.value.trim());
        }
    });

    document.querySelectorAll('input[name="enemigos[]"]').forEach(input => {
        if (input.value.trim()) {
            superheroe.enemigos.push(input.value.trim());
        }
    });

    const enviarBoton = document.querySelector('.boton-editar');
    enviarBoton.disabled = true;
    enviarBoton.textContent = 'Editando...';

    try {
        const response = await fetch(`/api/actualizarHeroe/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(superheroe)
        });

        const data = await response.json();

        if (response.ok) {
            await Swal.fire({
                icon: 'success',
                title: '¡Superhéroe editado!',
                text: 'El superhéroe fue actualizado exitosamente.',
                confirmButtonText: 'Aceptar',
                timer: 2500,
                timerProgressBar: true
            });
            window.location.href = '/api/dashboard';
        } else {
            // Mostrar errores del backend
            let mensajeError = data.mensaje || 'Error al editar el superhéroe';
            
            if (data.errores && data.errores.length > 0) {
                const listaErrores = data.errores.map(e => `• ${e.campo}: ${e.mensaje}`).join('\n');
                mensajeError = listaErrores;
            }

            await Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: mensajeError,
                confirmButtonText: 'Corregir'
            });

            enviarBoton.disabled = false;
            enviarBoton.textContent = 'Editar Superhéroe';
        }
    } catch (error) {
        console.error('Error:', error);
        await Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'Por favor, intenta de nuevo.'
        });
        enviarBoton.disabled = false;
        enviarBoton.textContent = 'Editar Superhéroe';
    }
});

window.addEventListener('DOMContentLoaded', () => {
    inicializarArrays();
});