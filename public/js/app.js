$(document).ready(function() {
    $(document).on('click', '.projects li a', function(e) {
        e.preventDefault();
        $('.projects a').removeClass('selected');
        $(this).addClass('selected');
    });

    $(document).on('click', '#project-pierce', function(e) {
        e.preventDefault;
        $('.list-panel').hide();
        $('#pierce-tasks').show();
        $('.task-panel').hide();
        $('#pierce-project').show();
    });

    $(document).on('click', 'table a', function(e) {
        e.preventDefault;
        $('.task-panel').hide();
    });

    $(document).on('click', 'a#task-engine', function(e) {
        e.preventDefault();
        $('#pierce-task-engine').show();
    });

    $(document).on('click', '#calendar a#monday', function(e) {
        e.preventDefault();

        if ($(this).hasClass('active')) {
            $('#calendar-monday').hide();
            $(this).removeClass('active');
        } else {
            $('#calendar a').removeClass('active');
            $('#calendar-monday').show();
            $(this).addClass('active');
        }
    });
});