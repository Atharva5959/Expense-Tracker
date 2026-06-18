const API_URL =
"https://expense-tracker-o3jp.onrender.com";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

async function loadCategories() {
    const response = await fetch(
        "https://expense-tracker-o3jp.onrender.com/categories",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const categories = await response.json();

    let options = `
        <option value="">
            Select Category
        </option>
    `;

    categories.forEach(category => {
        options += `
            <option value="${category.id}">
                ${category.name}
            </option>
        `;
    });

    document.getElementById("categoryId").innerHTML = options;
}

async function getCategoryMap() {
    const response = await fetch(
        "https://expense-tracker-o3jp.onrender.com/categories",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const categories = await response.json();

    let map = {};

    categories.forEach(category => {
        map[category.id] = category.name;
    });

    return map;
}

async function addExpense() {
    const title =
        document.getElementById("title").value;

    const amount =
        document.getElementById("amount").value;

    const expense_date =
        document.getElementById("expenseDate").value;

    const category_id =
        document.getElementById("categoryId").value;

    if (
        !title ||
        !amount ||
        !expense_date ||
        !category_id
    ) {
        alert("Please fill all fields");
        return;
    }

    const response = await fetch(
        "https://expense-tracker-o3jp.onrender.com/expenses",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                title: title,
                amount: Number(amount),
                category_id: category_id,
                expense_date: expense_date
            })
        }
    );

    if (response.ok) {
        alert("Expense Added");

        document.getElementById("title").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("expenseDate").value = "";
        document.getElementById("categoryId").value = "";

        loadExpenses();
    } else {
        const error = await response.json();

        alert(
            error.detail ||
            "Failed to add expense"
        );
    }
}

async function deleteExpense(expenseId) {
    const confirmDelete =
        confirm("Delete this expense?");

    if (!confirmDelete) {
        return;
    }

    const response = await fetch(
        `https://expense-tracker-o3jp.onrender.com/expenses/${expenseId}`,
        {
            method: "DELETE",

            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (response.ok) {
        alert("Expense Deleted");

        loadExpenses();
    } else {
        alert("Failed to delete expense");
    }
}

async function loadExpenses() {
    const categoryMap =
        await getCategoryMap();

    const response = await fetch(
        "http://127.0.0.1:8000/expenses",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    let html = "";

    data.forEach(expense => {
        html += `
            <tr>
                <td>${expense.title}</td>

                <td>₹${expense.amount}</td>

                <td>${expense.expense_date || "-"}</td>

                <td>
                    ${categoryMap[expense.category_id] || "Unknown"}
                </td>

                <td>
                    <button
                        onclick="deleteExpense('${expense.id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById(
        "expenseTable"
    ).innerHTML = html;
}

loadCategories();
loadExpenses();