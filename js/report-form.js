// Lógica para mostrar mensajes específicos al seleccionar el tipo de incapacidad

$(document).ready(function () {
    function mostrarMensaje() {
        var tipoIncapacidad = $("#tipoIncapacidad").val();
        var mensaje = '';

        switch (tipoIncapacidad) {
            case 'enfermedad':
                mensaje = 'Los documentos que debe enviar son los siguientes: Certificado de la incapacidad con días de incapacidad y diagnóstico.';
                break;
            case 'accidenteTransito':
                mensaje = 'Los documentos que debe enviar son los siguientes: Certificado de la incapacidad con días de incapacidad y diagnóstico. FURIPS.';
                break;
            case 'accidenteLaboral':
                mensaje = 'Los documentos que debe enviar son los siguientes: Certificado de la incapacidad con días de incapacidad y diagnóstico.';
                break;
            case 'licenciaMaternidad':
                mensaje = 'Los documentos que debe enviar son los siguientes: Certificado de la incapacidad o documento donde se especifique las semanas de gestación al momento del parto, certificado de nacido vivo, registro civil, fotocopia del documento de identidad de la madre.';
                break;
            case 'licenciaPaternidad':
                mensaje = 'Los documentos que debe enviar son los siguientes: Certificado de la incapacidad o documento donde se especifique las semanas de gestación al momento del parto, certificado de nacido vivo, registro civil, fotocopia del documento de identidad de la madre.';
                break;
        }

        // Actualiza el contenido y clase de la alerta
        if(mensaje != ''){        
            $("#mensajeIncapacidad").html('<strong>Mensaje:</strong><br>' + mensaje);
            $(".alert").removeClass("d-none").addClass("alert-success");
        } else {
            $(".alert").removeClass("alert-success").addClass("d-none");
        }
    }

    $("#tipoIncapacidad").change(function () {
        mostrarMensaje();
    });

    mostrarMensaje();

    $("#reportForm").submit(function(e) {
        e.preventDefault();
        $(".error-container").hide();
        // Mostrar animación de carga
        $(".loading-container").show();

        // Enviar formulario con AJAX
        $.ajax({
            url: "php/guardar_incapacidad.php",
            type: "POST",
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            xhr: function() {
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", function(event) {
                    if (event.lengthComputable) {
                        var percent = Math.round((event.loaded / event.total) * 100); 
                        $(".loading-text").text("Subiendo archivos... " + percent + "%");
                    }
                }, false);
                return xhr;
            },
            success: function(response) {
                setTimeout(function() {
                    // Ocultar formulario y animación de carga
                    $(".loading-container").hide();
                    // Manejar respuesta
                    try {
                        var jsonResponse = JSON.parse(response);

                        if ("errores" in jsonResponse) {
                            // Mostrar mensajes de error en rojo
                            var errores = jsonResponse.errores;

                            // Manejar errores de conexión
                            if ("conexion" in errores) {
                                $(".error-container").text(errores.conexion).show();
                                return;
                            }

                            // Manejar errores de base de datos
                            if ("base_de_datos" in errores) {
                                $(".error-container").text(errores.base_de_datos).show();
                                return;
                            }

                            // Manejar errores de archivos
                            if ("archivo" in errores) {
                                for (var i = 0; i < errores.archivo.length; i++) {
                                    $(".error-container").append(errores.archivo[i]).show();
                                }
                                return;
                            }
                        }

                        if ("mensajes" in jsonResponse) {
                            // Mensajes de éxito
                            $(".error-container").hide();
                            $("#success-container").show();
                            $("#mensajeExito").text("Incapacidad reportada correctamente");

                            // Redireccionar a index.php después de 2 segundos
                            setTimeout(function () {
                                window.location.href = "index.php";
                            }, 3000);
                        }
                    } catch (error) {
                        console.error("Error al analizar la respuesta JSON:", error);
                    }                    
                    
                    // Manejar respuesta
                    if (response.includes("Error")) {
                        // Mostrar mensaje de error en rojo
                        $(".error-container").show();
                        $(".error-container").text(response);
                    } else {
                        $(".error-container").hide();
                        $("#success-container").show();               
                        // Redireccionar a index.php después de 2 segundos
                        setTimeout(function() {
                            window.location.href = "index.php";
                        }, 3000);
                    }
                }, 1000);
            },
            error: function(xhr, status, error) {
                // Mostrar mensaje de error en rojo
                $(".error-container").text("Error al enviar el formulario. Por favor, inténtalo de nuevo.").css("color", "red");
                
                // Ocultar animación de carga y mostrar el formulario nuevamente
                $(".loading-container").hide();
                $("#reportForm").show();
            }
        });
    });

    // Asociar clic en el enlace al clic en el input file
    $('#seleccionar-documentos').click(function (e) {
        e.preventDefault();
        $('#archivos').click();
    });

    // Actualizar el texto del enlace cuando se selecciona un archivo
    $('#archivos').change(function () {
        var archivos = $(this)[0].files;
        if (archivos.length > 0) {
            var plural = archivos.length > 1 ? 's' : '';
            $('#seleccionar-documentos').text(archivos.length + ' documento' + plural + ' seleccionado' + plural);
        } else {
            $('#seleccionar-documentos').html('<i class="fas fa-upload"></i> Seleccionar documentos');
        }
    });    
});