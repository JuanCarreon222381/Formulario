document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formulario");

    formulario.addEventListener("submit", async function(event) {
        event.preventDefault();

        // Captura los valores del formulario
        const nombre = document.getElementById("Nombre").value.trim();
        const email = document.getElementById("Email").value.trim();
        const numero = document.getElementById("Numero").value.trim();
        const contraseña = document.getElementById("Contra").value.trim();
        const confirmaContraseña = document.getElementById("ConfirmaContra").value.trim();
        const perfilInput = document.getElementById("Perfil");

        // Validar que todos los campos estén llenos
        if (!nombre || !email || !numero || !contraseña || !confirmaContraseña || perfilInput.files.length === 0) {
            alert("Todos los campos deben estar llenos.");
            return;
        }

        // Validar que la contraseña y su confirmación coincidan
        if (contraseña !== confirmaContraseña) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        // Convertir la imagen a Base64
        const imagenBase64 = await convertirImagenABase64(perfilInput.files[0]);

        // Crear el objeto con los datos del usuario
        const datosUsuario = {
            nombre,
            email,
            numero,
            contraseña,
            imagen: imagenBase64
        };

        // Convertir a JSON
        const jsonData = JSON.stringify(datosUsuario, null, 2);
        console.log("Datos en JSON:", jsonData);

        // Guardar en localStorage
        localStorage.setItem("usuario", jsonData);

        // Generar y descargar el archivo JSON
        descargarArchivoJSON(jsonData, "usuario.json");

        alert("Registro exitoso. ¡Ahora puedes iniciar sesión!");
    });

    // Función de inicio de sesión
    document.getElementById("btnLogin").addEventListener("click", function() {
        const emailIngresado = document.getElementById("Email").value.trim();
        const contraseñaIngresada = document.getElementById("Contra").value.trim();

        // Obtener datos del usuario registrado
        const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

        if (!usuarioGuardado) {
            alert("No hay usuario registrado. Por favor, regístrate.");
            return;
        }

        // Verificar email y contraseña
        if (usuarioGuardado.email === emailIngresado && usuarioGuardado.contraseña === contraseñaIngresada) {
            alert(`¡Bienvenido ${usuarioGuardado.nombre}! Has iniciado sesión.`);
            console.log("Inicio de sesión exitoso");
        } else {
            alert("Email o contraseña incorrectos.");
        }
    });

    // Función para convertir imagen a Base64
    function convertirImagenABase64(imagen) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imagen);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Función para descargar el archivo JSON
    function descargarArchivoJSON(contenido, nombreArchivo) {
        const blob = new Blob([contenido], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});
