    <!-- notyf optional for error reporting -->
    <script src="assets/vendor/notyf/notyf.min.js"></script>
    <script src="assets/js/tablesorter.js"></script>
    
    <script>
        document.addEventListener("DOMContentLoaded", function(event) {
            tableSort = new tableSorter({ myTable: 'Table ID', 
                                          postPath: '/Post/Path', 
                                          dbRows: <?=$total?>, //total Database rows
                                          enableSearch: true, 
                                          searchBox: 'search-box' }); 
        });
    </script>
