    <script>
        document.addEventListener("DOMContentLoaded", function(event) {
            tableSort = new tableSorter({ myTable: 'Table ID', 
                                          postPath: '/Post/Path', 
                                          dbRows: <?=$total?>, //total Database rows
                                          enableSearch: true, 
                                          searchBox: 'search-box' }); 
        });
    </script>
