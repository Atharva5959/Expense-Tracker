const API_URL =
"https://expense-tracker-o3jp.onrender.com";

async function addCategory(){

    const token =
    localStorage.getItem("token");

    const name =
    document.getElementById(
        "categoryName"
    ).value;

    await fetch(
        "https://expense-tracker-o3jp.onrender.com/categories",
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json",
                "Authorization":
                `Bearer ${token}`
            },

            body:JSON.stringify({
                name:name
            })
        }
    );

    loadCategories();
}

async function loadCategories(){

    const token =
    localStorage.getItem("token");

    const response =
    await fetch(
        "https://expense-tracker-o3jp.onrender.com/categories",
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

    data.forEach(cat => {

        html += `
        <li>${cat.name}</li>
        `;
    });

    document.getElementById(
        "categoryList"
    ).innerHTML = html;
}

loadCategories();