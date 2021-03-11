const Modal = {
    open(){
        document.querySelector('.modal-overlay').classList.add("active")
        Form.description = document.querySelector('input#description')
        Form.amount = document.querySelector('input#amount')
        Form.date = document.querySelector('input#date')
        Today.setToday()
    }, 
    close() {
       document.querySelector('.modal-overlay').classList.remove("active")
    },

    openEditModal(){
        document.querySelector('.modal-over').classList.add("active")
        Form.description = document.querySelector('input#description1')
        Form.amount = document.querySelector('input#amount1')
        Form.date = document.querySelector('input#date1')
     }, 

     closeEditModal() {
        document.querySelector('.modal-over').classList.remove("active")
     },

     openConfirmModal(index) {
        document.querySelector('.modal-confirm').classList.add("active")
        Transaction.confirmDeleteIndex = index
     },

     closeConfirmModal() {
        document.querySelector('.modal-confirm').classList.remove("active")
     }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions",
        JSON.stringify(transactions))
    },
}

const Transaction = {
    all: Storage.get(),
    i: 0, 
    confirmDeleteIndex: 0,

    add(transaction) {
        Transaction.all.push(transaction);

        App.reload()
    },

    att(transaction) {
        Transaction.all.splice(this.i, 1, transaction)

        App.reload()
    },

    remove() {
        Transaction.all.splice(this.confirmDeleteIndex, 1)
        Modal.closeConfirmModal();

        App.reload()
    },

    update(index) {
        let Up = Transaction.all[index]

        let description = Up.description;
        let amount = Up.amount
        let Stringdate = Up.date
        
        const splittedDate = Stringdate.split("/")
        date = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`
        
        Modal.openEditModal()
        Form.description.value = `${description}`
        Form.amount.value = `${amount}`
        Form.date.value = `${date}`
        this.i = index
    },

    incomes() {
        let income = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount
            }
        })

        return income;
    },

    expenses() {
        let expense = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount
            }
        })


        return expense;
    },

    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.update(${index})" src="./assets/icons8-edit-32.png" alt="Remover transação">
            <img onclick="Modal.openConfirmModal(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>
        `

        return html
    },

    updateBalance() {
        document.getElementById("incomeDisplay").innerHTML =  Utils.formatCurrency(Transaction.incomes())
        document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransaction() {
        DOM.transactionsContainer.innerHTML = "";
    }
}

const Utils = {
    formatAmount(value) {
        return Math.round(value)
    },

    formatDate(value) {
        const splittedDate = value.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
 
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g, "")
        
        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    },

    confirmAction() {
        
    }
}

const Sort = {
    isUp: true,

    sortTableByValue() {
        let table = document.getElementById('data-table');
        let switching = true;
        while(switching) {
            switching = false;
            rows = table.rows;
            for(let i = 1; i < (rows.length - 1); i++) {
                let shouldSwitch = false;
                x = rows[i].getElementsByTagName('td')[1].innerHTML;
                Nx = Number(String(x).replace("R$&nbsp;", "").replace(',', '').replace('.', ''));
                y = rows[i + 1].getElementsByTagName('td')[1].innerHTML;
                Ny = Number(String(y).replace("R$&nbsp;", "").replace(',', '').replace('.', ''));
                if (Sort.isUp) {
                    if (Ny > Nx) {
                        shouldSwitch = true;
                        if(shouldSwitch) {
                            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                            switching = true;
                        }
                    }
                } else {
                    if (Nx > Ny) {
                        shouldSwitch = true;
                        if(shouldSwitch) {
                            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                            switching = true;
                        }
                    }
                   
                }      
            }
        }
        Sort.isUp = Sort.isUp === true ? false : true;
    },

    sortTableByDate() {
        let table = document.getElementById('data-table');
        let switching = true;
        while(switching) {
            switching = false;
            rows = table.rows;
            for(let i = 1; i < (rows.length - 1); i++) {
                let shouldSwitch = false;
                x = rows[i].getElementsByTagName('td')[2].innerHTML;
                let splittedDate = x.split("/");
                x = `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
                x = new Date(x);

                y = rows[i + 1].getElementsByTagName('td')[2].innerHTML;
                let splittedDateY = y.split("/");
                y = `${splittedDateY[2]}/${splittedDateY[1]}/${splittedDateY[0]}`;
                y = new Date(y);
                
                if (Sort.isUp) {
                    if (y > x) {
                        shouldSwitch = true;
                        if(shouldSwitch) {
                            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                            switching = true;
                        }
                    }
                } else {
                    if (x > y) {
                        shouldSwitch = true;
                        if(shouldSwitch) {
                            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                            switching = true;
                        }
                    }
                   
                }      
            }
        }
        Sort.isUp = Sort.isUp === true ? false : true;
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues();
        if ( description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Todos os campos devem ser preenchidos!")
        }
    },

    formatData() {
        
        let { description, amount, date } = Form.getValues()
        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    }, 

    saveTransaction(transaction) {
        Transaction.add(transaction)
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()
            const transaction = Form.formatData()
            Form.saveTransaction(transaction)
            Form.clearFields()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }  
    },

    sub() {
        Form.validateFields()
        const transaction = Form.formatData()
        Transaction.att(transaction)
        Form.clearFields()
        Modal.closeEditModal()
    }
}

const DarkTheme = {
    darkTheme: 0,
    
    darkThemeIsOn() {
        this.darkTheme = this.darkTheme === 1 ? 0 : 1;
        this.darkOn();
    },

    darkOn() {
        if (this.darkTheme === 1) {
            this.turnThemeDarkOn();
        } else {
            this.turnThemeDarkOff();
        }
    },

    turnThemeDarkOn() {
        document.querySelector('body').classList.add("dark");
        let a = document.getElementById("adjust");
        a.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width="30" height="30"
        viewBox="0 0 172 172"
        style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#cccccc"><path d="M54.7175,20.5325c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-1.59906,0.36281 -2.72781,1.80063 -2.6875,3.44v3.44h-3.44c-0.1075,0 -0.215,0 -0.3225,0c-1.89469,0.09406 -3.37281,1.70656 -3.27875,3.60125c0.09406,1.89469 1.70656,3.37281 3.60125,3.27875h3.44v3.44c-0.01344,1.23625 0.63156,2.39188 1.70656,3.02344c1.075,0.61813 2.39187,0.61813 3.46687,0c1.075,-0.63156 1.72,-1.78719 1.70656,-3.02344v-3.44h3.44c1.23625,0.01344 2.39188,-0.63156 3.02344,-1.70656c0.61813,-1.075 0.61813,-2.39187 0,-3.46687c-0.63156,-1.075 -1.78719,-1.72 -3.02344,-1.70656h-3.44v-3.44c0.04031,-0.99437 -0.36281,-1.94844 -1.075,-2.62031c-0.72562,-0.68531 -1.70656,-1.02125 -2.6875,-0.92719zM97.395,44.6125l-4.515,0.645c-23.3275,3.3325 -41.28,23.39469 -41.28,47.6225c0,26.5525 21.6075,48.16 48.16,48.16c24.22781,0 44.27656,-17.9525 47.6225,-41.28l0.645,-4.515l-4.515,0.645c-2.00219,0.28219 -3.96406,0.43 -5.9125,0.43c-22.84375,0 -41.28,-18.43625 -41.28,-41.28c0,-1.94844 0.14781,-3.91031 0.43,-5.9125zM89.5475,53.4275c-0.02687,0.55094 -0.1075,1.04813 -0.1075,1.6125c0,26.5525 21.6075,48.16 48.16,48.16c0.56438,0 1.06156,-0.08062 1.6125,-0.1075c-4.60906,17.76438 -20.22344,31.0675 -39.4525,31.0675c-22.84375,0 -41.28,-18.43625 -41.28,-41.28c0,-19.22906 13.30313,-34.85687 31.0675,-39.4525zM27.1975,61.8125c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-1.59906,0.36281 -2.72781,1.80063 -2.6875,3.44c-0.1075,0 -0.215,0 -0.3225,0c-1.89469,0.09406 -3.37281,1.70656 -3.27875,3.60125c0.09406,1.89469 1.70656,3.37281 3.60125,3.27875c-0.01344,1.23625 0.63156,2.39188 1.70656,3.02344c1.075,0.61813 2.39187,0.61813 3.46687,0c1.075,-0.63156 1.72,-1.78719 1.70656,-3.02344c1.23625,0.01344 2.39188,-0.63156 3.02344,-1.70656c0.61813,-1.075 0.61813,-2.39187 0,-3.46687c-0.63156,-1.075 -1.78719,-1.72 -3.02344,-1.70656c0.04031,-0.99437 -0.36281,-1.94844 -1.075,-2.62031c-0.72562,-0.68531 -1.70656,-1.02125 -2.6875,-0.92719z"></path></g></g></svg>`
    },

    turnThemeDarkOff() {
        document.querySelector('body').classList.remove("dark");
        let a = document.getElementById("adjust");
        a.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width="30" height="30"
        viewBox="0 0 172 172"
        style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#cccccc"><path d="M85.94625,13.71297c-1.89722,0.02966 -3.41223,1.58976 -3.38625,3.48703v20.64c-0.01754,1.24059 0.63425,2.39452 1.7058,3.01993c1.07155,0.62541 2.39684,0.62541 3.46839,0c1.07155,-0.62541 1.72335,-1.77935 1.7058,-3.01993v-20.64c0.01273,-0.92983 -0.35149,-1.82522 -1.00967,-2.48214c-0.65819,-0.65692 -1.55427,-1.01942 -2.48408,-1.00489zM37.45703,34.02375c-1.39859,0.00309 -2.65612,0.85256 -3.18113,2.14887c-0.52501,1.29631 -0.21302,2.78145 0.78926,3.75691l14.44531,14.44531c0.86282,0.89862 2.14403,1.26059 3.34951,0.94631c1.20549,-0.31427 2.1469,-1.25568 2.46117,-2.46117c0.31427,-1.20549 -0.04769,-2.48669 -0.94631,-3.34951l-14.44531,-14.44531c-0.64928,-0.66743 -1.54136,-1.04317 -2.4725,-1.0414zM134.43547,34.02375c-0.89371,0.02663 -1.74194,0.40014 -2.365,1.0414l-14.44531,14.44531c-0.89862,0.86282 -1.26059,2.14403 -0.94631,3.34951c0.31427,1.20549 1.25568,2.1469 2.46117,2.46117c1.20549,0.31427 2.48669,-0.04769 3.34951,-0.94631l14.44531,-14.44531c1.01742,-0.98897 1.32333,-2.50111 0.77034,-3.80778c-0.553,-1.30667 -1.85146,-2.13983 -3.26971,-2.098zM86,51.6c-0.48269,-0.00549 -0.96113,0.09065 -1.40422,0.28219c-18.34123,0.77589 -32.99578,15.58162 -32.99578,34.11781c0,19.03467 15.36533,34.4 34.4,34.4c19.03467,0 34.4,-15.36533 34.4,-34.4c0,-18.5339 -14.65103,-33.3385 -32.98906,-34.11781c-0.44516,-0.19246 -0.92599,-0.28863 -1.41094,-0.28219zM86,58.48c15.36533,0 27.52,12.15467 27.52,27.52c0,15.36533 -12.15467,27.52 -27.52,27.52c-15.36533,0 -27.52,-12.15467 -27.52,-27.52c0,-15.36533 12.15467,-27.52 27.52,-27.52zM17.2,82.56c-1.24059,-0.01754 -2.39452,0.63425 -3.01993,1.7058c-0.62541,1.07155 -0.62541,2.39684 0,3.46839c0.62541,1.07155 1.77935,1.72335 3.01993,1.7058h20.64c1.24059,0.01754 2.39452,-0.63425 3.01993,-1.7058c0.62541,-1.07155 0.62541,-2.39684 0,-3.46839c-0.62541,-1.07155 -1.77935,-1.72335 -3.01993,-1.7058zM134.16,82.56c-1.24059,-0.01754 -2.39452,0.63425 -3.01993,1.7058c-0.62541,1.07155 -0.62541,2.39684 0,3.46839c0.62541,1.07155 1.77935,1.72335 3.01993,1.7058h20.64c1.24059,0.01754 2.39452,-0.63425 3.01993,-1.7058c0.62541,-1.07155 0.62541,-2.39684 0,-3.46839c-0.62541,-1.07155 -1.77935,-1.72335 -3.01993,-1.7058zM51.87547,116.58375c-0.89371,0.02663 -1.74194,0.40014 -2.365,1.0414l-14.44531,14.44531c-0.89862,0.86282 -1.26059,2.14403 -0.94631,3.34951c0.31427,1.20549 1.25568,2.1469 2.46117,2.46117c1.20549,0.31427 2.48669,-0.04769 3.34951,-0.94631l14.44531,-14.44531c1.01742,-0.98897 1.32333,-2.50111 0.77034,-3.80778c-0.553,-1.30667 -1.85146,-2.13983 -3.26971,-2.098zM120.01703,116.58375c-1.39859,0.00309 -2.65612,0.85256 -3.18113,2.14887c-0.52501,1.29631 -0.21302,2.78145 0.78926,3.75691l14.44531,14.44531c0.86282,0.89862 2.14403,1.26059 3.34951,0.94631c1.20549,-0.31427 2.1469,-1.25568 2.46117,-2.46117c0.31427,-1.20549 -0.04769,-2.48669 -0.94631,-3.34951l-14.44531,-14.44531c-0.64928,-0.66743 -1.54136,-1.04317 -2.4725,-1.0414zM85.94625,130.67297c-1.89722,0.02966 -3.41223,1.58976 -3.38625,3.48703v20.64c-0.01754,1.24059 0.63425,2.39452 1.7058,3.01993c1.07155,0.62541 2.39684,0.62541 3.46839,0c1.07155,-0.62541 1.72335,-1.77935 1.7058,-3.01993v-20.64c0.01273,-0.92983 -0.35149,-1.82522 -1.00967,-2.48214c-0.65819,-0.65692 -1.55427,-1.01942 -2.48408,-1.00489z"></path></g></g></svg> `
    },
}

const Today = {
    field: document.querySelector('#date'),
    date: new Date(),

    setToday() {
        Today.field.value = this.date.getFullYear().toString() + '-' + (this.date.getMonth() + 1).toString().padStart(2, 0) + 
        '-' + this.date.getDate().toString().padStart(2, 0);
    }
}

const App = {
    init() {
        Transaction.all.forEach( (transaction, index) => {
            DOM.addTransaction(transaction, index);
        } )
        
        DOM.updateBalance(); 
        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransaction();
        App.init();
    },
}

App.init()