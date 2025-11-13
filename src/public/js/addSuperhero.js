let contadoresArray = {
    poderes: 0,
    aliados: 0,
    enemigos: 0
};

// Agregar items a arrays
function añadirItem(tipo) {
    const contenedor = document.getElementById(`${tipo}Contenedor`);
    const id = contadoresArray[tipo]++;
            
    const div = document.createElement('div');
    div.className = 'array-input-grupo';
    div.id = `${tipo}-${id}`;
            
    div.innerHTML = `
        <input 
            type="text" 
            name="${tipo}[]"
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

const errorNombreSuperheroe = document.getElementById('error-nombreSuperheroe');
const errorNombreReal = document.getElementById('error-nombreReal');
const errorEdad = document.getElementById('error-edad');
const errorPoderes = document.getElementById('error-poderes');

function validarForm() {
    let esValido = true;

    // Ocultar errores anteriores
    errorNombreSuperheroe.style.display = "none";
    errorNombreReal.style.display = "none";
    errorEdad.style.display = "none";
    errorPoderes.style.display = "none";

    const nombreSuper = document.getElementById('nombreSuperheroe').value.trim();
    const nombreReal = document.getElementById('nombreReal').value.trim();
    const edad = document.getElementById('edad').value;
    const poderes = document.querySelectorAll('input[name="poderes[]"]');

    if (!nombreSuper) {
        errorNombreSuperheroe.textContent = 'El nombre del Superhéroe debe ser válido';
        errorNombreSuperheroe.style.display = "block";
        esValido = false;
    } else if (nombreSuper.length < 3 || nombreSuper.length > 60) {
        errorNombreSuperheroe.textContent = 'El nombre del Superhéroe debe tener entre 3 y 60 caracteres';
        errorNombreSuperheroe.style.display = "block";
        esValido = false;
    }

    if (!nombreReal) {
        errorNombreReal.textContent = 'El nombre real debe ser válido';
        errorNombreReal.style.display = "block";
        esValido = false;
    } else if (nombreReal.length < 3 || nombreReal.length > 60) {
        errorNombreReal.textContent = 'El nombre real debe tener entre 3 y 60 caracteres';
        errorNombreReal.style.display = "block";
        esValido = false;
    }

    if (!edad) {
        errorEdad.textContent = 'La edad debe ser válida';
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

        console.log('SUPERHEROE:', superheroe);
        // Deshabilitar botón
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

                await Swal.fire({
                    title: 'Error',
                    text: data.mensaje || 'Error al crear el superhéroe.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
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
    }else{
        Swal.fire({
            title: 'Formulario inválido',
            text: 'Por favor revisa los campos antes de continuar.',
            icon: 'warning',
            confirmButtonText: 'Entendido'
        });
    }

});

// Agregar un poder por defecto al cargar
window.addEventListener('DOMContentLoaded', () => {
    añadirItem('poderes');
});