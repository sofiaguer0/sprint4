let contadoresArray = {
    poderes: 0,
    aliados: 0,
    enemigos: 0
};

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

// Manejar envío del formulario (SIN VALIDACIÓN EN FRONTEND)
document.getElementById('superheroeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const superheroe = {
        nombreSuperHeroe: document.getElementById('nombreSuperheroe').value.trim(),
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

    console.log('SUPERHEROE:', superheroe);
    
    const enviarBoton = document.querySelector('.boton-agregar');
    enviarBoton.disabled = true;
    enviarBoton.textContent = 'Creando...';

    try {
        const response = await fetch('/api/heroes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(superheroe)
        });

        const data = await response.json();
        console.log('DATA:', data);

        if (response.ok) {
            await Swal.fire({
                title: '¡Superhéroe creado!',
                text: `El superhéroe ${superheroe.nombreSuperHeroe} se creó exitosamente.`,
                icon: 'success',
                confirmButtonText: 'Aceptar',
                timer: 2500,
                timerProgressBar: true
            });
            window.location.href = '/api/dashboard';
        } else {
            // Mostrar errores del backend
            let mensajeError = data.mensaje || 'Error al crear el superhéroe.';
            
            if (data.errores && data.errores.length > 0) {
                const listaErrores = data.errores.map(e => `• ${e.campo}: ${e.mensaje}`).join('\n');
                mensajeError = listaErrores;
            }

            await Swal.fire({
                title: 'Error de validación',
                text: mensajeError,
                icon: 'error',
                confirmButtonText: 'Corregir'
            });

            enviarBoton.disabled = false;
            enviarBoton.textContent = 'Crear Superhéroe';
        }
    } catch (error) {
        console.error('Error:', error);
        await Swal.fire({
            title: 'Error de conexión',
            text: 'Por favor, intenta de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });

        enviarBoton.disabled = false;
        enviarBoton.textContent = 'Crear Superhéroe';
    }
});

// Agregar un poder por defecto al cargar
window.addEventListener('DOMContentLoaded', () => {
    añadirItem('poderes');
});