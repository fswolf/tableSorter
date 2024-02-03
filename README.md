
![image](https://github.com/fswolf/tableSorter/assets/8468295/645ccb55-e2b2-40a6-83a9-f82b64a92a0e)

    <!-- Notyf -->
    <script src="assets/vendor/notyf/notyf.min.js"></script>
    <!-- tableSorter can use notyf -->!

    <script src="assets/js/tablesorter.js"></script>

    <script>
        document.addEventListener("DOMContentLoaded", function(event) {
            let notyf = new Notyf({ duration: 4000 });
            let tableSort = new tableSorter({ myTable: 'myAvatars', 
                                              postPath: '/avatars/view', 
                                              dbRows: <?=$total?>, 
                                              enableSearch: true, //enable search if wanted
                                              searchBox: 'search-box', //set search input id
                                              notyf: notyf }); //include notyf if used
        });
    </script>
