async function confirmarEliminacion(id, nombre) {
    const result = await Swal.fire({
        title: `¿Eliminar a ${nombre}?`,
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
        eliminarHeroe(id, nombre);
    }
}
async function eliminarHeroe(id, nombre) {
    try {
        const response = await fetch(`eliminarSuperID/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await Swal.fire("Eliminado", `Superhéroe ${nombre} eliminado exitosamente`, "success");
            window.location.reload();
        } else {
            await Swal.fire("Error", "No se pudo eliminar el superhéroe", "error");
        }
    } catch (error) {
        console.error("Error:", error);
        await Swal.fire("Error", "Hubo un problema al eliminar el superhéroe", "error");
    }
}