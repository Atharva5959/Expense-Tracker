async function addCategory(){

    const token =
    localStorage.getItem("token");

    const name =
    document.getElementById(
        "categoryName"
    ).value;

    await fetch(
        "http://127.0.0.1:8000/categories",
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
        "http://127.0.0.1:8000/categories",
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