$(function () {
    $('[data-tooltip]').each(function () {
        new bootstrap.Tooltip(this, {
            title: $(this).data('tooltip'),
            placement: 'right',
            trigger: 'manual'
        });
    });

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

    $("#btnCollapseMenu").on("click", function () {
        toggleSidebar();
    });
});

function abrirModalViaje() {
    let modal = new bootstrap.Modal(document.getElementById('modalViaje'));
    modal.show();
}

function toggleSidebar() {
    let sidebar = $('#sidebar');
    sidebar.toggleClass('collapsed');

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