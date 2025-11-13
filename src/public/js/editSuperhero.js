let contadoresArray = {
    poderes: 0,
    aliados: 0,
    enemigos: 0
};

const superhero = window.superheroe;
const id = superhero._id;

// Agregar items a arrays
function añadirItem(tipo, valor) {
    const contenedor = document.getElementById(`${tipo}Contenedor`);
    const id = contadoresArray[tipo]++;
            
    const div = document.createElement('div');
    div.className = 'array-input-grupo';
    div.id = `${tipo}-${id}`;
            
    div.innerHTML = `
        <input 
            type="text" 
            name="${tipo}[]"
            value="${valor}"
            required
        >
        <button type="button" class="boton-remover" onclick="quitarItem('${tipo}', ${id})">
            Eliminar
        </button>
    `;
            
    contenedor.appendChild(div);
}

// Eliminar items de arrays
function quitarItem(tipo, id) {
    const contenedorAux = document.getElementById(`${tipo}Contenedor`);
    const itemsAux = contenedorAux.querySelectorAll('.array-input-grupo');

    if(tipo === 'poderes' && itemsAux.length === 1){
        alert('Minimo un poder');
        return;
    }

    const element = document.getElementById(`${tipo}-${id}`);

    if (element) {
        element.remove();
    }
}

function inicializarArrays(){
    if(superhero.poderes && superhero.poderes.length > 0){
        superhero.poderes.forEach(poder => {
            añadirItem('poderes', poder);
        });
    }else{
         //como minimo uno al empezar
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

const errorNombreSuperheroe = document.getElementById('error-nombreSuperheroe');
const errorNombreReal = document.getElementById('error-nombreReal');
const errorEdad = document.getElementById('error-edad');
const errorPoderes = document.getElementById('error-poderes');

function validarForm(){
    let esValido = true;

    errorNombreSuperheroe.style.display = "none";
    errorNombreReal.style.display = "none";
    errorEdad.style.display = "none";
    errorPoderes.style.display = "none";

    const nombreSuper = document.getElementById('nombreSuperheroe').value.trim();
    const nombreReal = document.getElementById('nombreReal').value.trim();
    const edad = document.getElementById('edad').value;
    const poderes = document.querySelectorAll('input[name="poderes[]"]');

    if(!nombreSuper){
        errorNombreSuperheroe.textContent = 'El nombre del Superheroe debe ser valido';
        errorNombreSuperheroe.style.display = "block";
        esValido = false;
    }else if(nombreSuper.length < 3 || nombreSuper.length > 60){
        errorNombreSuperheroe.textContent = 'El nombre del Superheroe debe ser de 3 a 60 caracteres';
        errorNombreSuperheroe.style.display = "block";
        esValido = false;
    }

    if(!nombreReal){
        errorNombreReal.textContent = 'El nombre real debe ser valido';
        errorNombreReal.style.display = "block";
        esValido = false;
    }else if(nombreReal.length < 3 || nombreReal.length > 60){
        errorNombreReal.textContent = 'El nombre real debe ser de 3 a 60 caracteres';
        errorNombreReal.style.display = "block";
        esValido = false;
    }

    if(!edad){
        errorEdad.textContent = 'La edad debe ser valida';
        errorEdad.style.display = "block";
        esValido = false;
    }

    poderes.forEach(poder => {
        const valor = poder.value.trim();
        if (valor.length < 3 || valor.length > 60) {
            errorPoderes.textContent = 'Cada poder debe tener entre 3 y 60 caracteres';
            errorPoderes.style.display = "block";
            esValido = false;
        }
    });

    return esValido;

}


// Manejar envío del formulario
document.getElementById('superheroeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if(validarForm()){
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

        // Deshabilitar botón
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

            console.log('DATA:', data);
            
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

                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.mensaje || 'Error al editar el superhéroe'
                });

                enviarBoton.disabled = false;
                enviarBoton.textContent = 'Editar Superhéroe';

            }
        } catch (error) {

            await Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'Por favor, intenta de nuevo.'
            });
            enviarBoton.disabled = false;
            enviarBoton.textContent = 'Editar Superhéroe';

        }
    }else{

        Swal.fire({
            icon: 'warning',
            title: 'Formulario no válido',
            text: 'Por favor, revisa los campos antes de enviar.'
        });

    }

});

// Agregar un poder por defecto al cargar
window.addEventListener('DOMContentLoaded', () => {
    inicializarArrays();
});