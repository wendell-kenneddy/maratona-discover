const modal = {
  open() {
    //Open  modal
    //Add the active class to the modal

    document
      .querySelector('.modal-overlay')
      .classList
      .add('active')
  },

  close() {
    //Close modal
    //Remove the active class of the modal

    document
      .querySelector('.modal-overlay')
      .classList
      .remove('active')
  }
}

const transactions = [
  {
    id: 0,
    description: "Website Creation",
    amount: 500000,
    date: "08/10/2020"
  },
  {
    id: 1,
    description: "Internet",
    amount: -23000,
    date: "20/01/2021"
  },
  {
    id: 2,
    description: "Luz",
    amount: -5000000,
    date: "20/01/2021"
  }
]

//Calculate the incomes, expenses and the total 
const calculateTransactions = {
  all: transactions,

  //Add a new transaction
  add(transaction) {
    calculateTransactions.all.push(transaction)

    App.reload()
  },

  remove(index) {
    this.all.splice(index, 1)

    App.reload()
  },

  //Add the value of incomes
  incomes() {
    let income = 0;

    calculateTransactions.all.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    })

    return income;
  },

  //Add the value of expenses
  expenses() {
    let expense = 0;

    calculateTransactions.all.forEach(transaction => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    })

    return expense;
  },

  //Remove the expenses from the incomes
  total() {
    return calculateTransactions.incomes() + calculateTransactions.expenses()
  }
}

const manipulateDOM = {

  transactionsContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction) {

    //Create a tr
    const createTr = document.createElement("tr")
    createTr.innerHTML = manipulateDOM.innerHTMLTransaction(transaction)

    //Append the tr to the data-table body
    manipulateDOM.transactionsContainer.appendChild(createTr)
  },

  //Add transaction data to HTML document
  innerHTMLTransaction(transaction) {
    const cssClass = transaction.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
    <td class="description">${transaction.description}</td>
    <td class="${cssClass}">${amount}</td>
    <td class="date">${transaction.date}</td>
    <td><img src="./assets/minus.svg" alt="Remover Transação"></td>
    `

    return html;
  },

  updateBalance() {
    document
        .getElementById('incomeDisplay')
        .innerHTML = Utils.formatCurrency(calculateTransactions.incomes())
    document
        .getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrency(calculateTransactions.expenses())
    document
        .getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrency(calculateTransactions.total())
  },

  clearTransactions() {
    manipulateDOM.transactionsContainer.innerHTML = ""
  }

}

const Utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g, "")

    value = value / 100

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    }
    )

    return signal + value
  }
}

const App = {
  init() {
      calculateTransactions.all.forEach(transaction => {
        manipulateDOM.addTransaction(transaction)
      })

      DOM.updateBalance()
  },
  
  reload() {
      manipulateDOM.clearTransactions()
      App.init()
  },
}

App.init()
