$(function () {
            $('[data-bs-toggle="tooltip"]').tooltip();
            $('[data-bs-toggle="popover"]').popover();
            $('.carousel').carousel({
                interval: 3000
            });
            $('#contacto').on('show.bs.modal', function(e){
                console.log('el modal se esta mostrando');
                $('#reservar').removeClass('btn-outline-success');
                $('#reservar').addClass('btn-primary');
                $('#reservar').prop('disabled', true);
            });
            $('#contacto').on('shown.bs.modal', function(e){
                console.log('el modal se mostró');
            });
            $('#contacto').on('hide.bs.modal', function(e){
                console.log('el modal se oculta');
            });
            $('#contacto').on('hidden.bs.modal', function(e){
                console.log('el modal se ocultó');
                $('#reservar').prop('disabled', false);
            });
        });