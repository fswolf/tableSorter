    <!-- Notyf -->
    <script src="assets/vendor/notyf/notyf.min.js"></script>
    <!-- tableSorter can use notyf -->
    <script src="assets/js/tablesorter.js"></script>

    <script>
        document.addEventListener("DOMContentLoaded", function(event) {
            let notyf = new Notyf({ duration: 4000 });
            let tableSort = new tableSorter({ myTable: 'myAvatars', 
                                          postPath: '/avatars/view', 
                                          dbRows: <?=$total?>, 
                                          enableSearch: true, 
                                          searchBox: 'search-box', 
                                          notyf: notyf }); 
        });
    </script>
