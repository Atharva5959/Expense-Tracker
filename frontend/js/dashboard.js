const token =
localStorage.getItem("token");

if(!token){

    window.location.href =
    "login.html";
}

function loadUserName(){

    const name =
    localStorage.getItem(
        "userName"
    );

    document.getElementById(
        "welcomeText"
    ).innerHTML =
    `Welcome Back, ${name} 👋`;
}

function logout(){

    localStorage.removeItem(
        "token"
    );

    window.location.href =
    "login.html";
}

async function loadDashboard(){

    const response =
    await fetch(
        "http://127.0.0.1:8000/dashboard",
        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );

    const data =
    await response.json();

    document.getElementById(
        "totalExpense"
    ).innerHTML =
    "₹" + data.total_expense;

    document.getElementById(
        "totalBudget"
    ).innerHTML =
    "₹" + data.total_budget;

    document.getElementById(
        "remainingBudget"
    ).innerHTML =
    "₹" + data.remaining_budget;

    document.getElementById(
        "totalCategories"
    ).innerHTML =
    data.total_categories;
}

async function loadRecentExpenses(){

    const response =
    await fetch(
        "http://127.0.0.1:8000/expenses",
        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );

    const data =
    await response.json();

    let html = "";

    data
    .slice(-5)
    .reverse()
    .forEach(expense => {

        html += `
        <tr>

            <td>${expense.title}</td>

            <td>₹${expense.amount}</td>

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
        "recentExpenses"
    ).innerHTML =
    html;
}

async function deleteExpense(
    expenseId
){

    const confirmDelete =
    confirm(
        "Delete this expense?"
    );

    if(!confirmDelete){

        return;
    }

    await fetch(
        `http://127.0.0.1:8000/expenses/${expenseId}`,
        {
            method:"DELETE",

            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );

    loadRecentExpenses();

    loadDashboard();

    loadChart();
}


async function loadChart(){

    const expenseResponse =
    await fetch(
        "http://127.0.0.1:8000/expenses",
        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );

    const categoryResponse =
    await fetch(
        "http://127.0.0.1:8000/categories",
        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );

    const expenses =
    await expenseResponse.json();

    const categories =
    await categoryResponse.json();

    let categoryMap = {};

    categories.forEach(category => {

        categoryMap[
            category.id
        ] = category.name;
    });

    let totals = {};

    expenses.forEach(expense => {

        const categoryName =
        categoryMap[
            expense.category_id
        ];

        if(!totals[categoryName]){

            totals[
                categoryName
            ] = 0;
        }

        totals[
            categoryName
        ] += expense.amount;
    });

    new Chart(

        document.getElementById(
            "expenseChart"
        ),

        {
            type:"pie",

            data:{

                labels:
                Object.keys(totals),

                datasets:[{

                    data:
                    Object.values(totals)

                }]
            }
        }
    );
}

loadDashboard();
loadRecentExpenses();
loadChart();
loadUserName();