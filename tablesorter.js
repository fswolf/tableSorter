/* -----------------------------------------------------------------
|   Table Sorter
|   For paging and searching of bootstrap tables 
|   Version 0.8.0
|   Written by Ryan Autet
|   https://github.com/fswolf/
 -----------------------------------------------------------------*/
"use strict";

class tableSorter {
    constructor(properties = {}) {
        this.myTable;
        this.myRows;
        this.myButtons;
        this.tableText;

        this.postPath = '/post/path';
        this.signInPath = '/signin';

        this.totalRows;
        this.dbRows;
        this.displayedRows = 10;
        this.totalPages = 1;
        this.currentPage = 1;
        this.currentButton = 1; 
        this.buttonValues = [1, 2, 3, 4, 5];

        this.enableSearch = false;
        this.searchBox = 'search';
        this.searchQuery = false;
        this.searchEndListen;
        //this.searchIcon;

        this.notyf = false;
        //if(typeof Notyf === 'function') this.notyf = new Notyf({ duration: 4000 });

        for (const key in properties) { 
            if(properties.hasOwnProperty(key)) this[key] = properties[key];
        }

        this.init();
    }

    addRow(data) {
        let tbody = this.myTable.querySelector('tbody');
        if (!tbody) tbody = this.myTable.createTBody();
        let newRow = tbody.insertRow(-1);
        //let cols = Object.keys(data).length; //this is no good for blank entrys 
        let cols = this.myTable.rows[0].cells.length; 

        for (let i = 0; i < cols; i++) {
            let cell = newRow.insertCell(i);
            let value = Object.values(data)[i];
            if (value === undefined) cell.innerHTML = "";
            else cell.innerHTML = value;
        }
    }

    removeAllRows() {
        let rowCount = this.myTable.rows.length;
        for (let i = rowCount - 1; i > 0; i--) this.myTable.deleteRow(i);
    }

    removeHighlight(pageButton) {
        let pageLi = this.myButtons[pageButton].closest('li');
        if(pageLi.classList.contains('active')) pageLi.classList.remove('active');
    }

    addHightlight(pageButton) {
        let pageLi = this.myButtons[pageButton].closest('li');
        pageLi.classList.add('active');
    }

    disableButtion(buttion) {
        let li = this.myButtons[buttion].closest('li');
        li.classList.add('disabled');
    }

    enableButtion(buttion) {
        let li = this.myButtons[buttion].closest('li');
        if(li.classList.contains('disabled')) li.classList.remove('disabled');
    }

    hideButtion(button) {
        let li = this.myButtons[button].closest('li');
        li.classList.add('d-none');
    }

    showButtion(button) {
        let li = this.myButtons[button].closest('li');
        if(li.classList.contains('d-none')) li.classList.remove('d-none');
    }

    updateButtonDisplay(amount) {
        for(let i = 1; i <= 5; i++) {
            let newValue = this.buttonValues[i-1] + amount;
            this.buttonValues[i-1] = newValue;
            this.myButtons[i].innerHTML = newValue;
        }

        this.removeHighlight(this.currentButton);

        if(Math.sign(amount) == 1) this.currentButton = 1;
        else this.currentButton = 5;

        this.addHightlight(this.currentButton);
        this.toggleButtons();
    }

    toggleButtons() {
        this.totalPages = Math.ceil(this.totalRows / this.displayedRows);
        for(let i = 1; i <= 5; i++) {
            let value = this.buttonValues[i-1];
            if(value > this.totalPages) this.hideButtion(i);
            else this.showButtion(i);
        }

        if(this.totalPages == 1) this.disableButtion(6);
        else this.enableButtion(6);
    }

    updateText() {
        let start = 1
        let end = this.displayedRows;

        if(this.currentPage > 1) {
            start = (this.currentPage * this.displayedRows) - this.displayedRows;
            end = this.currentPage * this.displayedRows;
            if(end > this.totalRows) end = this.totalRows;
        }

        if(this.totalRows < end) end = this.totalRows;

        this.tableText.innerHTML = 'Showing <b>' + start + '</b> to <b>' + end + '</b> out of <b>' + this.totalRows + '</b> entries';
    }

    resetPageDisplay() {
        for(let i = 1; i <= 5; i++) this.myButtons[i].innerHTML = i;
        this.removeHighlight(this.currentButton);
        this.currentPage = 1;
        this.currentButton = 1;
        this.buttonValues  = [1, 2, 3, 4, 5];
        this.disableButtion(0);
        this.enableButtion(6);
        this.addHightlight(this.currentButton);
    }

    message(text) {
        if(this.notyf) this.notyf.error(text);
        else console.error("Error:", text);
    }

    fetchRows(request) {
        const self = this; 
        fetch(self.postPath, {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(request) 
        }).then(response => { 
            if (!response.ok) {
                self.message(response.statusText);
                return;
            }

            response.json().then(function (data) {
                if(data) {
                    if(data.success) {
                        self.removeAllRows();
                        data.newRows.forEach(function(newRow) { self.addRow(newRow); });
                        if(data.rowCount) {
                            if(self.totalRows != data.rowCount) {
                                self.totalRows = data.rowCount;
                                self.toggleButtons();
                            }
                        }
                        self.updateText();
                    }
                    else {
                        if(data.signin) window.location = self.signInPath;
                        else self.message(data.error);
                    }
                }
            })
        }).catch(error => {
            self.message(data.error);
        });
    }

    changePage(pageOffset) {
        let offset = (pageOffset * this.displayedRows);
        if(this.searchQuery) this.fetchRows({ request: 'search', input: this.searchQuery, rows: this.displayedRows, offset: offset });
        else this.fetchRows({ request: 'page', rows: this.displayedRows, offset: offset });
        if(this.currentPage > this.buttonValues[4]) this.updateButtonDisplay(5); //shift this to toggle
    }

    pageButtion(buttion) {
        this.removeHighlight(this.currentButton);
        this.currentPage = this.buttonValues[buttion - 1];
        this.changePage(this.currentPage - 1);
        this.currentButton = buttion;
        this.addHightlight(buttion);
        
        if(this.currentPage == 1) this.disableButtion(0); //disable prev buttion
        else this.enableButtion(0); //enable prev buttion

        if(this.currentPage == this.totalPages) this.disableButtion(6);
        else this.enableButtion(6);
    }

    nextButton() {
        this.currentPage += 1;
        if(this.currentPage >= 1) this.enableButtion(0); //enable prev buttion

        this.removeHighlight(this.currentButton);
        this.currentButton += 1;
        if(this.currentButton > 5) this.currentButton = 5;
        this.addHightlight(this.currentButton);
        if(this.currentPage >= this.totalPages) this.disableButtion(6);
    }

    prevButton() {
        this.currentPage -= 1;
        
        if(this.currentPage <= 1) { 
            this.currentPage = 1;
            this.disableButtion(0);
        }

        this.removeHighlight(this.currentButton);
        this.currentButton -= 1;
        if(this.currentButton < 1) this.currentButton = 1;
        this.addHightlight(this.currentButton);

        if(this.currentPage < this.totalPages) this.enableButtion(6);
    }

    init() {
        this.myTable = document.getElementById(this.myTable);
        this.myRows = document.getElementById('myRows');
        this.myButtons = document.querySelectorAll(".page-link");
        this.tableText = document.getElementById('tableText');

        this.totalRows = this.dbRows;

        if(this.enableSearch) {
            this.searchBox = document.getElementById(this.searchBox);
            this.searchIcon = document.getElementById(this.searchIcon);
        }

        if(this.myTable) {
            this.toggleButtons();    
            this.ready();
        } 
        else alert('Table not found please check table id.');
    }

    ready() {
        const self = this; 
        //row view number selector
        self.myRows.onchange = (event) => { 
            let rows = event.target.value;
            if(rows) {
                self.displayedRows = rows;
                self.resetPageDisplay();
                if(self.searchQuery) self.fetchRows({ request: 'search', input: self.searchQuery, rows: rows, offset: 0 });
                else self.fetchRows({ request: 'page', rows: rows, offset: 0 });
                self.resetPageDisplay();
                self.toggleButtons();
            }
        }
        //page button listeners
        self.myButtons.forEach(function(button) {
            button.addEventListener("click", function(event) {
                event.preventDefault();
                switch (event.target.id) {
                    case "myPrev":
                        self.prevButton();
                        self.changePage(self.currentPage - 1); 
                        if(self.currentPage < self.buttonValues[0]) self.updateButtonDisplay(-5);
                        break;
                    case "myNext":
                        self.nextButton();
                        self.changePage(self.currentPage - 1);
                        if(self.currentPage > self.buttonValues[4]) self.updateButtonDisplay(5);
                        break;
                    case "pageButton1":
                        self.pageButtion(1);
                        break;
                    case "pageButton2":
                        self.pageButtion(2);
                        break;
                    case "pageButton3":
                        self.pageButtion(3);
                        break;
                    case "pageButton4":
                        self.pageButtion(4);
                        break;
                    case "pageButton5":
                        self.pageButtion(5);
                        break;
                    default:
                        //alert(event.target.id);
                        break;
                }
            });
        });

        if(self.enableSearch) {
            self.searchBox.addEventListener("keydown", function(event) {
                if (event.key === "Enter") {
                    if(self.searchBox.value) {
                        self.searchQuery = self.searchBox.value;
                        self.fetchRows({ request: 'search', input: self.searchBox.value, rows: self.displayedRows, offset: 0 });
                        self.resetPageDisplay();
                    }
                }
            });

            self.searchBox.addEventListener("input", function(event) {
                if(self.searchQuery) {
                    if(!self.searchBox.value) {
                        self.totalRows = self.dbRows;
                        self.searchQuery = false;
                        self.resetPageDisplay();
                        self.updateText();
                        self.toggleButtons();
                        self.changePage(0);
                    }
                }
            });
        }
    }
}   
