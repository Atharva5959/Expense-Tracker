const API_URL = "https://expense-tracker-o3jp.onrender.com";

const token = localStorage.getItem("token");

if (!token) {
window.location.href = "/";
}

function loadUserName() {
const name = localStorage.getItem("userName") || "User";

```
document.getElementById(
    "welcomeText"
).innerHTML = `Welcome Back, ${name} 👋`;
```

}

function logout() {
localStorage.removeItem("token");
localStorage.removeItem("userName");

```
window.location.href = "/";
```

}

async function loadDashboard() {
try {
const response = await fetch(
`${API_URL}/dashboard`,
{
headers: {
Authorization: `Bearer ${token}`
}
}
);

```
    const data = await response.json();

    document.getElementById("totalExpense").innerHTML =
        "₹" + data.total_expense;

    document.getElementById("totalBudget").innerHTML =
        "₹" + data.total_budget;

    document.getElementById("remainingBudget").innerHTML =
        "₹" + data.remaining_budget;

    document.getElementById("totalCategories").innerHTML =
        data.total_categories;

} catch (error) {
    console.error("Dashboard Error:", error);
}
```

}

async function loadRecentExpenses() {
try {
const response = await fetch(
`${API_URL}/expenses`,
{
headers: {
Authorization: `Bearer ${token}`
}
}
);

```
    const data = await response.json();

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
                    <button onclick="deleteExpense('${expense.id}')">
                        Delete
                    </button>
                </td>
            </tr>
            `;
        });

    document.getElementById(
        "recentExpenses"
    ).innerHTML = html;

} catch (error) {
    console.error("Expense Load Error:", error);
}
```

}

async function deleteExpense(expenseId) {

```
const confirmDelete =
    confirm("Delete this expense?");

if (!confirmDelete) {
    return;
}

try {

    await fetch(
        `${API_URL}/expenses/${expenseId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    loadRecentExpenses();
    loadDashboard();
    loadChart();

} catch (error) {
    console.error("Delete Error:", error);
}
```

}

async function loadChart() {

```
try {

    const expenseResponse =
        await fetch(
            `${API_URL}/expenses`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

    const categoryResponse =
        await fetch(
            `${API_URL}/categories`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

    const expenses =
        await expenseResponse.json();

    const categories =
        await categoryResponse.json();

    let categoryMap = {};

    categories.forEach(category => {
        categoryMap[category.id] =
            category.name;
    });

    let totals = {};

    expenses.forEach(expense => {

        const categoryName =
            categoryMap[expense.category_id] ||
            "Unknown";

        if (!totals[categoryName]) {
            totals[categoryName] = 0;
        }

        totals[categoryName] += expense.amount;
    });

    new Chart(
        document.getElementById(
            "expenseChart"
        ),
        {
            type: "pie",

            data: {
                labels: Object.keys(totals),

                datasets: [{
                    data: Object.values(totals)
                }]
            }
        }
    );

} catch (error) {
    console.error("Chart Error:", error);
}
```

}

loadDashboard();
loadRecentExpenses();
loadChart();
loadUserName();
