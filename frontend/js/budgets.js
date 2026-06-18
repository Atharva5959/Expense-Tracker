const API_URL =
"https://expense-tracker-o3jp.onrender.com";

const token =
localStorage.getItem("token");

if(!token){
    window.location.href = "login.html";
}

async function addBudget(){

    const month =
    document.getElementById("month").value;

    const amount =
    document.getElementById("amount").value;

    await fetch(
        `${API_URL}/budgets`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
            },
            body:JSON.stringify({
                month:month,
                amount:Number(amount)
            })
        }
    );

    loadBudgets();
}

async function loadBudgets(){

    const response =
    await fetch(
        `${API_URL}/budgets`,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    let html = "";

    data.forEach(budget=>{
        html += `
        <li>
            ${budget.month}
            - ₹${budget.amount}
        </li>`;
    });

    document.getElementById("budgetList").innerHTML = html;
}

loadBudgets();