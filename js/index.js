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

    $('#btnModalRoles').on('click', function () {
        abrirModal('mdlMantRoles');
    });

    $('#btnModalEstados').on('click', function () {
        abrirModal('mdlMantEstados');
    });

    $('#btnModalManteciones').on('click', function () {
        abrirModal('mdlMantTiposMantencion');
    });

    $('#btnModalMarcasModelos').on('click', function () {
        abrirModal('mdlMantMarcasModelos');
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

        // =========================
    // ROLES
    // =========================
    $('#btnNuevoRol').on('click', function () {
        abrirModalNuevoRol();
    });

    $(document).on('click', '.btn-editar-rol', function () {
        const id = $(this).data('id');
        abrirModalEditarRol(id);
    });

    $('#btnGuardarRol').on('click', function () {
        guardarRol();
    });

    // =========================
    // ESTADOS
    // =========================
    $('#btnNuevoEstado').on('click', function () {
        abrirModalNuevoEstado();
    });

    $(document).on('click', '.btn-editar-estado', function () {
        const id = $(this).data('id');
        abrirModalEditarEstado(id);
    });

    $('#btnGuardarEstado').on('click', function () {
        guardarEstado();
    });

    // =========================
    // TIPOS DE MANTENCIÓN
    // =========================
    $('#btnNuevoTipoMantencion').on('click', function () {
        abrirModalNuevoTipoMantencion();
    });

    $(document).on('click', '.btn-editar-tipo-mantencion', function () {
        const id = $(this).data('id');
        abrirModalEditarTipoMantencion(id);
    });

    $('#btnGuardarTipoMantencion').on('click', function () {
        guardarTipoMantencion();
    });

    // =========================
    // MARCAS / MODELOS
    // =========================
    $('#btnNuevoMarcaModelo').on('click', function () {
        abrirModalNuevoMarcaModelo();
    });

    $(document).on('click', '.btn-editar-marca-modelo', function () {
        const id = $(this).data('id');
        abrirModalEditarMarcaModelo(id);
    });

    $('#btnGuardarMarcaModelo').on('click', function () {
        guardarMarcaModelo();
    });

    $(document).on('click', '.btn-cerrar-viaje', function () {
        abrirModalCerrarViaje(this);
    });

    $('#slcCargoBencina').on('change', function () {
        const cargoBencina = $(this).val() === 'si';
        $('#bloqueCargaBencina').toggleClass('d-none', !cargoBencina);

        if (!cargoBencina) {
            $('#txtMontoBencina').val('');
            $('#flBoletaBencina').val('');
            $('#txtObservacionBencina').val('');
        }
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

function abrirModalMantenedores(idModal) {
    const modal = new bootstrap.Modal(document.getElementById(idModal), {
        backdrop: true,
        focus: true
    });
    modal.show();

    setTimeout(() => {
        $('.modal-backdrop').last().addClass('backdrop-secundario');
    }, 100);
}

//
// ROLES
//
function abrirModalNuevoRol() {
    $('#frmRol')[0].reset();
    $('#hdnRolId').val('');
    $('#ttlMdlRolForm').html('<i class="bi bi-plus-circle me-2"></i>Nuevo rol');
    abrirModalMantenedores('mdlRolForm');
}

function abrirModalEditarRol(id) {
    $('#frmRol')[0].reset();
    $('#hdnRolId').val(id);
    $('#ttlMdlRolForm').html('<i class="bi bi-pencil-square me-2"></i>Editar rol');

    const rolesMock = {
        1: { nombre: 'Administrador', descripcion: 'Acceso total al sistema', estado: 'activo' },
        2: { nombre: 'Usuario', descripcion: 'Uso operativo del sistema', estado: 'activo' },
        3: { nombre: 'Supervisor', descripcion: 'Supervisión y control', estado: 'inactivo' }
    };

    const rol = rolesMock[id];
    if (!rol) return;

    $('#txtNombreRol').val(rol.nombre);
    $('#txtDescripcionRol').val(rol.descripcion);
    $('#slcEstadoRol').val(rol.estado);

    abrirModalMantenedores('mdlRolForm');
}

function guardarRol() {
    const id = $('#hdnRolId').val();
    const nombre = $('#txtNombreRol').val().trim();
    const descripcion = $('#txtDescripcionRol').val().trim();
    const estado = $('#slcEstadoRol').val();

    if (!nombre) {
        alert('Debes ingresar el nombre del rol.');
        return;
    }

    console.log('Guardar rol', { id, nombre, descripcion, estado });
    bootstrap.Modal.getInstance(document.getElementById('mdlRolForm')).hide();
}

//
// ESTADOS
//
function abrirModalNuevoEstado() {
    $('#frmEstado')[0].reset();
    $('#hdnEstadoId').val('');
    $('#ttlMdlEstadoForm').html('<i class="bi bi-plus-circle me-2"></i>Nuevo estado');
    abrirModalMantenedores('mdlEstadoForm');
}

function abrirModalEditarEstado(id) {
    $('#frmEstado')[0].reset();
    $('#hdnEstadoId').val(id);
    $('#ttlMdlEstadoForm').html('<i class="bi bi-pencil-square me-2"></i>Editar estado');

    const estadosMock = {
        1: {
            nombre: 'Activo',
            contexto: 'usuario',
            descripcion: 'Usuario habilitado para operar',
            estadoRegistro: 'activo'
        },
        2: {
            nombre: 'En mantención',
            contexto: 'vehiculo',
            descripcion: 'Vehículo no disponible por mantención',
            estadoRegistro: 'activo'
        },
        3: {
            nombre: 'Disponible',
            contexto: 'asignacion',
            descripcion: 'Disponible para ser utilizado',
            estadoRegistro: 'inactivo'
        }
    };

    const estado = estadosMock[id];
    if (!estado) return;

    $('#txtNombreEstado').val(estado.nombre);
    $('#slcContextoEstado').val(estado.contexto);
    $('#txtDescripcionEstado').val(estado.descripcion);
    $('#slcEstadoRegistro').val(estado.estadoRegistro);

    abrirModalMantenedores('mdlEstadoForm');
}

function guardarEstado() {
    const id = $('#hdnEstadoId').val();
    const nombre = $('#txtNombreEstado').val().trim();
    const contexto = $('#slcContextoEstado').val();
    const descripcion = $('#txtDescripcionEstado').val().trim();
    const estadoRegistro = $('#slcEstadoRegistro').val();

    if (!nombre || !contexto) {
        alert('Debes completar los campos obligatorios del estado.');
        return;
    }

    console.log('Guardar estado', { id, nombre, contexto, descripcion, estadoRegistro });
    bootstrap.Modal.getInstance(document.getElementById('mdlEstadoForm')).hide();
}

//
// TIPOS DE MANTENCIÓN
//
function abrirModalNuevoTipoMantencion() {
    $('#frmTipoMantencion')[0].reset();
    $('#hdnTipoMantencionId').val('');
    $('#ttlMdlTipoMantencionForm').html('<i class="bi bi-plus-circle me-2"></i>Nuevo tipo de mantención');
    abrirModalMantenedores('mdlTipoMantencionForm');
}

function abrirModalEditarTipoMantencion(id) {
    $('#frmTipoMantencion')[0].reset();
    $('#hdnTipoMantencionId').val(id);
    $('#ttlMdlTipoMantencionForm').html('<i class="bi bi-pencil-square me-2"></i>Editar tipo de mantención');

    const tiposMock = {
        1: {
            nombre: 'Preventiva',
            descripcion: 'Mantención programada por kilometraje o tiempo',
            estado: 'activo'
        },
        2: {
            nombre: 'Correctiva',
            descripcion: 'Mantención por falla o reparación',
            estado: 'activo'
        },
        3: {
            nombre: 'Cambio de aceite',
            descripcion: 'Servicio específico de lubricación',
            estado: 'inactivo'
        }
    };

    const tipo = tiposMock[id];
    if (!tipo) return;

    $('#txtNombreTipoMantencion').val(tipo.nombre);
    $('#txtDescripcionTipoMantencion').val(tipo.descripcion);
    $('#slcEstadoTipoMantencion').val(tipo.estado);

    abrirModalMantenedores('mdlTipoMantencionForm');
}

function guardarTipoMantencion() {
    const id = $('#hdnTipoMantencionId').val();
    const nombre = $('#txtNombreTipoMantencion').val().trim();
    const descripcion = $('#txtDescripcionTipoMantencion').val().trim();
    const estado = $('#slcEstadoTipoMantencion').val();

    if (!nombre) {
        alert('Debes ingresar el nombre del tipo de mantención.');
        return;
    }

    console.log('Guardar tipo mantención', { id, nombre, descripcion, estado });
    bootstrap.Modal.getInstance(document.getElementById('mdlTipoMantencionForm')).hide();
}

//
// MARCAS / MODELOS
//
function abrirModalNuevoMarcaModelo() {
    $('#frmMarcaModelo')[0].reset();
    $('#hdnMarcaModeloId').val('');
    $('#ttlMdlMarcaModeloForm').html('<i class="bi bi-plus-circle me-2"></i>Nueva marca / modelo');
    abrirModalMantenedores('mdlMarcaModeloForm');
}

function abrirModalEditarMarcaModelo(id) {
    $('#frmMarcaModelo')[0].reset();
    $('#hdnMarcaModeloId').val(id);
    $('#ttlMdlMarcaModeloForm').html('<i class="bi bi-pencil-square me-2"></i>Editar marca / modelo');

    const marcasModelosMock = {
        1: { marca: 'Toyota', modelo: 'Yaris', estado: 'activo' },
        2: { marca: 'Toyota', modelo: 'RAV4', estado: 'activo' },
        3: { marca: 'Chevrolet', modelo: 'Groove', estado: 'inactivo' }
    };

    const item = marcasModelosMock[id];
    if (!item) return;

    $('#txtMarcaVehiculo').val(item.marca);
    $('#txtModeloVehiculo').val(item.modelo);
    $('#slcEstadoMarcaModelo').val(item.estado);

    abrirModalMantenedores('mdlMarcaModeloForm');
}

function guardarMarcaModelo() {
    const id = $('#hdnMarcaModeloId').val();
    const marca = $('#txtMarcaVehiculo').val().trim();
    const modelo = $('#txtModeloVehiculo').val().trim();
    const estado = $('#slcEstadoMarcaModelo').val();

    if (!marca || !modelo) {
        alert('Debes ingresar la marca y el modelo.');
        return;
    }

    console.log('Guardar marca/modelo', { id, marca, modelo, estado });
    bootstrap.Modal.getInstance(document.getElementById('mdlMarcaModeloForm')).hide();
}

function abrirModalCerrarViaje(btn) {
    const viajeId = $(btn).data('viaje-id');
    const vehiculoId = $(btn).data('vehiculo-id');
    const patente = $(btn).data('patente');
    const vehiculo = $(btn).data('vehiculo');
    const marca = $(btn).data('marca');
    const modelo = $(btn).data('modelo');
    const kmSalida = $(btn).data('kmsalida');
    const fechaInicio = $(btn).data('fechainicio');

    $('#hdnCerrarViajeId').val(viajeId);
    $('#hdnCerrarVehiculoId').val(vehiculoId);
    $('#txtCerrarVehiculo').val(vehiculo);
    $('#txtCerrarPatente').val(patente);
    $('#txtCerrarMarcaModelo').val(`${marca} / ${modelo}`);
    $('#txtCerrarFechaInicio').val(fechaInicio);
    $('#txtCerrarKmSalida').val(kmSalida);
    $('#txtCerrarKmEntrega').val('');
    $('#txtObservacionCierreViaje').val('');
    $('#slcCargoBencina').val('no').trigger('change');

    const modal = new bootstrap.Modal(document.getElementById('mdlCerrarViaje'));
    modal.show();
}