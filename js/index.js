let vehiculoDetalleActual = null;

$(function () {
    /* TOOLTIP */
    $('[data-tooltip]').each(function () {
        new bootstrap.Tooltip(this, {
            title: $(this).data('tooltip'),
            placement: 'right',
            trigger: 'manual'
        });
    });

    /* SIDEBAR */
    $('.nav-link i').on('mouseenter', function () {
        if ($('#sidebar').hasClass('collapsed')) {
            let t = bootstrap.Tooltip.getInstance(this);
            if (t) t.show();
        }
    });

    $('.nav-link i').on('mouseleave', function () {
        let t = bootstrap.Tooltip.getInstance(this);
        if (t) t.hide();
    });

    $('#btnCollapseMenu').on('click', function () {
        toggleSidebar();
    });

    $('#btnModalViaje').on('click', function () { 
        abrirModalViaje();
    });

    $(document).on('click', '#btnDetalleViaje', function () {
        let modal = new bootstrap.Modal(document.getElementById('mdlDetalleViaje'));
        modal.show();
    });

    $('.inicia-viaje').on('click', function () { 
        cargarFechaActual();
        cargarHoraActual();
    });

    $('.limpia-viaje').on('click', function () { 
        limpiarViaje();
    });

    /* MODALES ADMINISTRACIÓN */
    $('#btnGestionVehiculos').on('click', function () {
        abrirModal('mdlGestionVehiculos');
    });

    $('#btnGestionUsuarios').on('click', function () {
        abrirModal('mdlGestionUsuarios');
    });

    $('#btnAsignaciones').on('click', function () {
        abrirModal('mdlAsignaciones');
    });

    $('#btnViajesActivos').on('click', function () {
        abrirModal('mdlViajesActivos');
    });

    $('#btnAlertasMantencion').on('click', function () {
        abrirModal('mdlAlertasMantencion');
    });

    $('#btnFueraServicio').on('click', function () {
        abrirModal('mdlFueraServicio');
    });

    /* MODALES SECUNDARIOS */
    $('#btnNuevoVehiculo').on('click', function () {
        limpiarModalNuevoVehiculo();
        abrirModalSecundario('mdlNuevoVehiculo');
    });

    $(document).on('click', '.btnEditarVehiculo', function () {
        $('#txtEditPatente').val($(this).data('patente'));
        $('#txtEditMarca').val($(this).data('marca'));
        $('#txtEditModelo').val($(this).data('modelo'));
        $('#txtEditAnio').val($(this).data('anio'));
        $('#txtEditKm').val($(this).data('km'));
        $('#txtEditEstado').val($(this).data('estado'));

        abrirModalSecundario('mdlEditarVehiculo');
    });

    $(document).on('click', '.btnMantencionVehiculo', function () {
        $('#txtMantencionVehiculo').val($(this).data('vehiculo'));
        $('#txtMantencionPatente').val($(this).data('patente'));
        $('#txtMantencionMotivo').val('');

        abrirModalSecundario('mdlMantencionVehiculo');
    });

    $(document).on('click', '.btnDeshabilitarVehiculo', function () {
        $('#txtDeshabilitarVehiculo').val($(this).data('vehiculo'));
        $('#txtDeshabilitarPatente').val($(this).data('patente'));
        $('#txtDeshabilitarMotivo').val('');

        abrirModalSecundario('mdlDeshabilitarVehiculo');
    });

    $(document).on('click', '.btnRehabilitarVehiculo', function () {
        $('#txtRehabilitarVehiculo').val($(this).data('vehiculo'));
        $('#txtRehabilitarPatente').val($(this).data('patente'));

        abrirModalSecundario('mdlRehabilitarVehiculo');
    });

    /* BOTONES GUARDADO */
    $('#btnGuardarNuevoVehiculo').on('click', function () {
        let patente = $('#txtNuevoPatente').val().trim();
        let marca = $('#txtNuevoMarca').val().trim();
        let modelo = $('#txtNuevoModelo').val().trim();

        if (patente === '' || marca === '' || modelo === '') {
            alert('Debe completar al menos Patente, Marca y Modelo.');
            return;
        }

        alert('Vehículo guardado correctamente (maqueta).');
    });

    /* GESTIÓN USUARIOS */
    $('#btnBuscarUsuario').on('click', function () {
        buscarUsuarios();
    });

    $('#btnLimpiarFiltroUsuario').on('click', function () {
        limpiarFiltrosUsuarios();
    });

    $('#btnNuevoUsuario').on('click', function () {
        abrirModalNuevoUsuario();
    });

    $(document).on('click', '.btn-editar-usuario', function () {
        const usuario = $(this).data('usuario');
        abrirModalEditarUsuario(usuario);
    });

    $(document).on('click', '.btn-asignar-vehiculo', function () {
        const usuario = $(this).data('usuario');
        abrirModalAsignarVehiculo(usuario);
    });

    $(document).on('click', '.btn-quitar-vehiculo', function () {
        const usuario = $(this).data('usuario');
        quitarVehiculo(usuario);
    });

    $(document).on('click', '.btn-reset-clave', function () {
        const usuario = $(this).data('usuario');
        abrirModalResetClave(usuario);
    });

    $(document).on('click', '.btn-toggle-estado', function () {
        const usuario = $(this).data('usuario');
        const estado = $(this).data('estado');
        toggleEstadoUsuario(usuario, estado);
    });

    $('#btnGuardarUsuario').on('click', function () {
        guardarUsuario();
    });

    $('#btnConfirmarAsignacionVehiculo').on('click', function () {
        guardarAsignacionVehiculo();
    });

    $('#btnGuardarNuevaClave').on('click', function () {
        guardarNuevaClave();
    });

    $(document).on('click', '.btn-quitar-vehiculo', function () {
        const usuario = $(this).data('usuario');

        if (!confirm(`¿Deseas quitar el vehículo asignado al usuario ${usuario}?`)) return;

        console.log('Quitar vehículo:', usuario);
    });

    $(document).on('click', '.btn-toggle-estado', function () {
        const usuario = $(this).data('usuario');
        const estado = $(this).data('estado');
        const nuevoEstado = estado === 'activo' ? 'inactivo' : 'activo';
        const accion = estado === 'activo' ? 'deshabilitar' : 'habilitar';

        if (!confirm(`¿Deseas ${accion} al usuario ${usuario}?`)) return;

        console.log('Cambiar estado:', { usuario, nuevoEstado });
    });




    $(document).on('change', '#slcUsuarioAsignacion', function () {
        const usuarioId = $(this).val();
        cargarVehiculosAsignados(usuarioId);
    });

    $('#btnGuardarAsignacion').on('click', function () {
        const usuarioId = $('#slcUsuarioAsignacion').val();
        const vehiculoId = $('#slcVehiculoDisponible').val();

        if (!usuarioId || !vehiculoId) {
            alert('Debes seleccionar un usuario y un vehículo.');
            return;
        }

        console.log('Asignar nuevo vehículo', { usuarioId, vehiculoId });
    });

    $(document).on('click', '.btn-quitar-vehiculo-asignado', function () {
        const vehiculoId = $(this).data('vehiculo-id');

        if (!confirm('¿Deseas quitar este vehículo de la asignación del usuario?')) return;

        console.log('Quitar asignación', { vehiculoId });
    });

    $(document).on('click', '.btn-ver-detalle-mantencion', function () {
        const vehiculoId = $(this).data('id');
        abrirModalDetalleVehiculo(vehiculoId);
    });

    $('#btnAbrirEnvioMantencionDesdeDetalle').on('click', function () {
        if (!vehiculoDetalleActual) return;

        $('#txtMantencionVehiculo').val(vehiculoDetalleActual.nombre);
        $('#txtMantencionPatente').val(vehiculoDetalleActual.patente);

        abrirModalSecundario('mdlMantencionVehiculo');
    });
});

function abrirModalViaje() {
    let modal = new bootstrap.Modal(document.getElementById('mdlViaje'));
    modal.show();
}

function toggleSidebar() {
    let sidebar = $('#sidebar');
    sidebar.toggleClass('collapsed');
    $('#sidebarHeader').toggleClass('collapsed-header');

    let esCollapsed = sidebar.hasClass('collapsed');

    if (esCollapsed) {
        $('#spBitacora').addClass('d-none');
    } else {
        setTimeout(() => {
            $('#spBitacora').removeClass('d-none');
        }, 100);

        $('[data-tooltip]').each(function () {
            let t = bootstrap.Tooltip.getInstance(this);
            if (t) t.hide();
        });

        console.log(bootstrap.Tooltip.getInstance($('#btnVehiculo')[0]));
    }
}

function cargarFechaActual() {
    let hoy = new Date();

    let anio = hoy.getFullYear();
    let mes = String(hoy.getMonth() + 1).padStart(2, '0');
    let dia = String(hoy.getDate()).padStart(2, '0');

    let fechaFormateada = `${anio}-${mes}-${dia}`;

    $('#txtFechaActual').val(fechaFormateada);
}

function cargarHoraActual() {
    let hoy = new Date();

    let horas = String(hoy.getHours()).padStart(2, '0');
    let minutos = String(hoy.getMinutes()).padStart(2, '0');

    let horaFormateada = `${horas}:${minutos}`;

    $('#txtHoraActual').val(horaFormateada);
}

function limpiarViaje() {
    $('#txtFechaActual').val('');
    $('#txtHoraActual').val('');
}

function abrirModal(id) {
    let modal = new bootstrap.Modal(document.getElementById(id));
    modal.show();
}

function abrirModalSecundario(id) {
    let modal = new bootstrap.Modal(document.getElementById(id), {
        backdrop: true,
        focus: true
    });

    modal.show();

    setTimeout(() => {
        $('.modal-backdrop').last().addClass('backdrop-secundario');
    }, 100);
}

function limpiarModalNuevoVehiculo() {
    $('#txtNuevoPatente').val('');
    $('#txtNuevoMarca').val('');
    $('#txtNuevoModelo').val('');
    $('#txtNuevoAnio').val('');
    $('#txtNuevoColor').val('');
    $('#txtNuevoKm').val('');
    $('#txtNuevoEstado').val('Disponible');
    $('#txtNuevoCombustible').val('Seleccione');
    $('#txtNuevoObservacion').val('');
}

function buscarUsuarios() {
    const usuario = $('#txtFiltroUsuario').val().trim();
    const estado = $('#slcFiltroEstado').val();

    console.log('Buscar usuarios', { usuario, estado });

    // Aquí luego conectas tu API o tu filtro local
}

function limpiarFiltrosUsuarios() {
    $('#txtFiltroUsuario').val('');
    $('#slcFiltroEstado').val('todos');

    console.log('Filtros limpiados');
    buscarUsuarios();
}

function nuevoUsuario() {
    console.log('Abrir modal de nuevo usuario');
    // abrirModalNuevoUsuario();
}

function editarUsuario(usuario) {
    console.log('Editar usuario:', usuario);
    // abrirModalEditarUsuario(usuario);
}

function restablecerClave(usuario) {
    console.log('Restablecer clave de:', usuario);

    if (confirm(`¿Deseas restablecer la contraseña del usuario ${usuario}?`)) {
        // llamada API
    }
}

function toggleEstadoUsuario(usuario, estadoActual) {
    const accion = estadoActual === 'habilitado' ? 'deshabilitar' : 'habilitar';

    if (confirm(`¿Deseas ${accion} al usuario ${usuario}?`)) {
        console.log(`${accion} usuario:`, usuario);
        // llamada API
    }
}

function abrirModalNuevoUsuario() {
    limpiarFormularioUsuario();

    $('#ttlMdlUsuarioForm').html('<i class="bi bi-person-plus me-2"></i>Nuevo usuario');
    $('#hdnUsuarioEdicion').val('');

    const modal = new bootstrap.Modal(document.getElementById('mdlUsuarioForm'), {
        backdrop: true,
        focus: true
    });
    modal.show();

    setTimeout(() => {
        $('.modal-backdrop').last().addClass('backdrop-secundario');
    }, 100);
}

function abrirModalEditarUsuario(usuario) {
    limpiarFormularioUsuario();

    $('#ttlMdlUsuarioForm').html('<i class="bi bi-pencil-square me-2"></i>Editar usuario');
    $('#hdnUsuarioEdicion').val(usuario);

    // Simulación de carga de datos
    if (usuario === 'clabrin') {
        $('#txtUsuario').val('clabrin');
        $('#txtNombreCompleto').val('Cristian Labrín');
        $('#txtCorreoUsuario').val('clabrin@empresa.cl');
        $('#slcRolUsuario').val('administrador');
        $('#slcEstadoUsuario').val('activo');
    }

    if (usuario === 'jrojas') {
        $('#txtUsuario').val('jrojas');
        $('#txtNombreCompleto').val('Juan Rojas');
        $('#txtCorreoUsuario').val('jrojas@empresa.cl');
        $('#slcRolUsuario').val('usuario');
        $('#slcEstadoUsuario').val('inactivo');
    }

    $('#txtClaveTemporal').val('');

    const modal = new bootstrap.Modal(document.getElementById('mdlUsuarioForm'), {
        backdrop: true,
        focus: true
    });
    modal.show();

    setTimeout(() => {
        $('.modal-backdrop').last().addClass('backdrop-secundario');
    }, 100);
}

function abrirModalAsignarVehiculo(usuario) {
    $('#hdnUsuarioAsignacion').val(usuario);
    $('#txtUsuarioAsignacion').val(usuario);
    $('#slcVehiculoAsignado').val('');
    $('#txtObservacionAsignacion').val('');

    const modal = new bootstrap.Modal(document.getElementById('mdlAsignarVehiculo'), {
        backdrop: true,
        focus: true
    });
    modal.show();

    setTimeout(() => {
        $('.modal-backdrop').last().addClass('backdrop-secundario');
    }, 100);
}

function abrirModalResetClave(usuario) {
    $('#hdnUsuarioResetClave').val(usuario);
    $('#txtUsuarioResetClave').val(usuario);
    $('#txtNuevaClave').val('');
    $('#txtConfirmarNuevaClave').val('');

    const modal = new bootstrap.Modal(document.getElementById('mdlResetClave'), {
        backdrop: true,
        focus: true
    });
    modal.show();

    setTimeout(() => {
        $('.modal-backdrop').last().addClass('backdrop-secundario');
    }, 100);
}

function limpiarFormularioUsuario() {
    $('#frmUsuario')[0].reset();
    $('#hdnUsuarioEdicion').val('');
}

function guardarUsuario() {
    const usuarioEdicion = $('#hdnUsuarioEdicion').val();
    const usuario = $('#txtUsuario').val().trim();
    const nombreCompleto = $('#txtNombreCompleto').val().trim();
    const correo = $('#txtCorreoUsuario').val().trim();
    const rol = $('#slcRolUsuario').val();
    const estado = $('#slcEstadoUsuario').val();
    const claveTemporal = $('#txtClaveTemporal').val().trim();

    if (!usuario || !nombreCompleto || !correo || !rol || !estado) {
        alert('Debes completar todos los campos obligatorios.');
        return;
    }

    if (!usuarioEdicion && !claveTemporal) {
        alert('Debes ingresar una contraseña temporal para el nuevo usuario.');
        return;
    }

    console.log('Guardar usuario', {
        usuarioEdicion,
        usuario,
        nombreCompleto,
        correo,
        rol,
        estado,
        claveTemporal
    });

    bootstrap.Modal.getInstance(document.getElementById('mdlUsuarioForm')).hide();
}

function guardarAsignacionVehiculo() {
    const usuario = $('#hdnUsuarioAsignacion').val();
    const vehiculo = $('#slcVehiculoAsignado').val();
    const observacion = $('#txtObservacionAsignacion').val().trim();

    if (!vehiculo) {
        alert('Debes seleccionar un vehículo.');
        return;
    }

    console.log('Asignar vehículo', {
        usuario,
        vehiculo,
        observacion
    });

    bootstrap.Modal.getInstance(document.getElementById('mdlAsignarVehiculo')).hide();
}

function guardarNuevaClave() {
    const usuario = $('#hdnUsuarioResetClave').val();
    const nuevaClave = $('#txtNuevaClave').val().trim();
    const confirmarClave = $('#txtConfirmarNuevaClave').val().trim();

    if (!nuevaClave || !confirmarClave) {
        alert('Debes completar ambos campos de contraseña.');
        return;
    }

    if (nuevaClave !== confirmarClave) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    console.log('Restablecer contraseña', {
        usuario,
        nuevaClave
    });

    bootstrap.Modal.getInstance(document.getElementById('mdlResetClave')).hide();
}

function abrirModalAsignacionVehiculos() {
    const modal = new bootstrap.Modal(document.getElementById('mdlAsignacionVehiculos'));
    modal.show();
}

function cargarVehiculosAsignados(usuarioId) {
    // Simulación
    const asignados = [
        { id: 1, nombre: 'Toyota Yaris' },
        { id: 2, nombre: 'Chevrolet Groove' }
    ];

    renderVehiculosAsignados(asignados);
}

function renderVehiculosAsignados(lista) {
    const contenedor = $('#lstVehiculosAsignados');
    contenedor.empty();

    if (!lista || lista.length === 0) {
        contenedor.addClass('vacia');
        return;
    }

    contenedor.removeClass('vacia');

    lista.forEach(v => {
        contenedor.append(`
            <div class="item-vehiculo-asignado">
                <span>${v.nombre}</span>
                <button 
                    type="button"
                    class="btn btn-outline-danger btn-sm btn-quitar-vehiculo-asignado"
                    data-vehiculo-id="${v.id}">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
        `);
    });
}

function abrirModalDetalleVehiculo(vehiculoId) {
    const vehiculo = obtenerDetalleVehiculo(vehiculoId);

    if (!vehiculo) return;

    vehiculoDetalleActual = vehiculo;

    $('#txtDetVehiculo').val(vehiculo.nombre);
    $('#txtDetPatente').val(vehiculo.patente);
    $('#txtDetMarca').val(vehiculo.marca);
    $('#txtDetModelo').val(vehiculo.modelo);
    $('#txtDetColor').val(vehiculo.color);
    $('#txtDetAnio').val(vehiculo.anio);
    $('#txtDetKilometraje').val(vehiculo.kilometraje);
    $('#txtDetEstado').val(vehiculo.estado);
    $('#txtDetUltMantencion').val(vehiculo.ultimaMantencion);
    $('#txtDetProxMantencion').val(vehiculo.proximaMantencion);
    $('#txtDetObservaciones').val(vehiculo.observaciones);

    const modal = new bootstrap.Modal(document.getElementById('mdlDetalleVehiculo'));
    modal.show();
}

function abrirModalEnviarMantencion(vehiculo) {
    $('#hdnVehiculoMantencionId').val(vehiculo.id);
    $('#txtMantencionVehiculo').val(vehiculo.nombre);
    $('#txtMantencionPatente').val(vehiculo.patente);
    $('#txtMantencionMotivo').val('');

    const modal = new bootstrap.Modal(document.getElementById('mdlEnviarMantencion'));
    modal.show();
}

function obtenerDetalleVehiculo(vehiculoId) {
    const data = {
        1: {
            id: 1,
            nombre: 'Toyota Yaris',
            patente: 'ABCD-11',
            marca: 'Toyota',
            modelo: 'Yaris',
            color: 'Blanco',
            anio: '2021',
            kilometraje: '29.800',
            estado: 'Próxima mantención',
            ultimaMantencion: '10-01-2026',
            proximaMantencion: '30.000 km',
            observaciones: 'Vehículo próximo a revisión preventiva.'
        },
        2: {
            id: 2,
            nombre: 'Toyota RAV4',
            patente: 'PKTW-63',
            marca: 'Toyota',
            modelo: 'RAV4',
            color: 'Gris',
            anio: '2020',
            kilometraje: '69.500',
            estado: 'Urgente',
            ultimaMantencion: '15-11-2025',
            proximaMantencion: '70.000 km',
            observaciones: 'Requiere ingreso prioritario a mantención.'
        },
        3: {
            id: 3,
            nombre: 'Chevrolet Groove',
            patente: 'LJHG-22',
            marca: 'Chevrolet',
            modelo: 'Groove',
            color: 'Negro',
            anio: '2023',
            kilometraje: '14.900',
            estado: 'Normal',
            ultimaMantencion: '01-02-2026',
            proximaMantencion: '20.000 km',
            observaciones: 'Sin observaciones relevantes.'
        }
    };

    return data[vehiculoId] || null;
}