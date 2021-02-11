const modal = {
  open() {
    //Open  modal
    //Add the active class to the modal

    document
      .querySelector('.modal-overlay')
      .classList
      .toggle('active')
  }
}

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("devfinances: transactions")) || []
  },

  set(transactions) {
    localStorage.setItem("devfinances: transactions", JSON.stringify(transactions))
  }
}

const calculateTransactions = {
  all: Storage.get(),

  //Add a new transaction
  add(transaction) {
    calculateTransactions.all.push(transaction)

    App.reload()
  },

  //Remove a transaction
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

    total = calculateTransactions.incomes() + calculateTransactions.expenses()

    if (total < 0) {
      document.querySelector('.card.total').classList.remove('income')
      document.querySelector('.card.total').classList.add('expense')

      document.getElementById('total-image').src = './assets/total.svg'
    } else if (total > 0) {
      document.querySelector('.card.total').classList.remove('expense')
      document.querySelector('.card.total').classList.add('income')

      document.getElementById('total-image').src = './assets/total.svg'
    } else {
      document.querySelector('.card.total').classList.remove('income')
      document.querySelector('.card.total').classList.remove('expense')

      document.getElementById('total-image').src = './assets/total-base.svg'
    }

    return total
  }
}

const manipulateDOM = {

  transactionsContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {

    //Create a tr
    const createTr = document.createElement("tr")
    createTr.innerHTML = manipulateDOM.innerHTMLTransaction(transaction, index)
    createTr.dataset.index = index

    //Append the tr to the data-table body
    manipulateDOM.transactionsContainer.appendChild(createTr)
  },

  //Add transaction data to HTML document
  innerHTMLTransaction(transaction, index) {
    const cssClass = transaction.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
    <td class="description">${transaction.description}</td>
    <td class="${cssClass}">${amount}</td>
    <td class="date">${transaction.date}</td>
    <td><img onclick="calculateTransactions.remove(${index})" src="./assets/minus.svg" alt="Remover Transação"></td>
    `

    return html;
  },

  //Update balance values
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

  //Clear table content
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
  },

  //Format input given amount 
  formatAmout(value) {
    value = Number(value) * 100

    return Math.round(value)
  },

  //Format input date from yyy/mm/dd to dd/mm/yyyy
  formatDate(date) {
    const splittedDate = date.split('-')

    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  }
}

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getInputData() {
    return {
      description: this.description.value,
      amount: this.amount.value,
      date: this.date.value
    }
  },

  //Check if all the fields were fulfilled
  validateFields() {
    const { description, amount, date } = this.getInputData()

    if (description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === "") {
      throw new Error("Por favor, preencha todos os campos")
    }
  },

  //Format input data
  formatData() {
    let { description, amount, date } = this.getInputData()

    amount = Utils.formatAmout(amount)

    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },

  clearFormFields() {
    this.description.value = ""
    this.amount.value = ""
    this.date.value = ""
  },

  //Events to try when submitting the form
  submit(event) {
    event.preventDefault()

    try {
      //Validate data
      this.validateFields()
      //Format data
      const transaction = this.formatData()
      //Save data and push to table
      calculateTransactions.add(transaction)
      //Clear form fields
      this.clearFormFields()
      modal.open()
    }
    catch (error) {
      alert(error.message)
    }

  }
}

const App = {
  init() {
    calculateTransactions.all.forEach(manipulateDOM.addTransaction)

    manipulateDOM.updateBalance()

    Storage.set(calculateTransactions.all)
  },

  reload() {
    manipulateDOM.clearTransactions()

    App.init()
  },
}

App.init()