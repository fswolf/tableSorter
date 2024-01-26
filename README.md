    <script>
        document.addEventListener("DOMContentLoaded", function(event) {
            tableSort = new tableSorter({ myTable: 'myAvatars', 
                                          postPath: '/avatars/view', 
                                          dbRows: <?=$total?>, 
                                          enableSearch: true, 
                                          searchBox: 'search-box' }); 
        });
    </script>
