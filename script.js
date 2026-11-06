
const state = {
    earnings: 0,
    expense: 0,
    net: 0,
    transactions: []
};

const formEl = document.getElementById("form");
const textEl = document.getElementById("text");
const amountEl = document.getElementById("amount");

const balanceEl = document.querySelector(".balance h2");
const transactionsEl = document.querySelector(".transactions");

const earnBtn = document.getElementById("earnBtn");
const expenseBtn = document.getElementById("expenseBtn");

const addTransaction = (e) => {

    e.preventDefault();

    
    const isEarn = e.submitter.id === "earnBtn";


    const formData = new FormData(formEl);

    const tdata = {};

    formData.forEach((value, key) => {
        tdata[key] = value;
    });

    const amount = Number(tdata.amount);

    
    if (!tdata.text.trim() || !amount || amount <= 0) {
        alert("Please enter valid details!");
        return;
    }


    const transaction = {
        id: Date.now(),
        text: tdata.text,
        amount: amount,
        type: isEarn ? "credit" : "debit"
    };


    state.transactions.push(transaction);


    if (isEarn) {
        state.earnings += amount;
    } else {
        state.expense += amount;
    }


    state.net = state.earnings - state.expense;

    
    updateUI();


    formEl.reset();
};

const updateUI = () => {

    
    balanceEl.innerText = `$${state.net.toFixed(2)}`;

    
    earnBtn.querySelector("p").innerText =
        `$${state.earnings.toFixed(2)}`;

    expenseBtn.querySelector("p").innerText =
        `$${state.expense.toFixed(2)}`;

    transactionsEl.innerHTML = "";

    
    state.transactions.forEach((transaction) => {

        const div = document.createElement("div");

        div.className = "transaction";

        const left = document.createElement("div");
        left.className = "left";

        const name = document.createElement("p");
        name.innerText = transaction.text;

        const amount = document.createElement("p");

        amount.innerText =
            `${transaction.type === "credit" ? "+" : "-"}$${transaction.amount.toFixed(2)}`;

        left.append(name, amount);

        const status = document.createElement("div");

        status.className = `status ${transaction.type}`;

        status.innerText =
            transaction.type === "credit" ? "C" : "D";


        const deleteBtn = document.createElement("button");

        deleteBtn.innerText = "X";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", () => {
            deleteTransaction(transaction.id);
        });

        div.append(left, status, deleteBtn);

        transactionsEl.appendChild(div);
    });
};

const deleteTransaction = (id) => {

    const transaction = state.transactions.find(
        (item) => item.id === id
    );

    if (!transaction) return;

    if (transaction.type === "credit") {
        state.earnings -= transaction.amount;
    } else {
        state.expense -= transaction.amount;
    }


    state.transactions = state.transactions.filter(
        (item) => item.id !== id
    );

    state.net = state.earnings - state.expense;

    updateUI();
};

formEl.addEventListener("submit", addTransaction);
