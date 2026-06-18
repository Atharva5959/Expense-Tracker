const API_URL =
"https://expense-tracker-o3jp.onrender.com";

async function login(){

    const email =
    document.getElementById(
        "email"
    ).value;

    const password =
    document.getElementById(
        "password"
    ).value;

    const response =
    await fetch(
        "https://expense-tracker-o3jp.onrender.com/login",
        {
            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({
                email:email,
                password:password
            })
        }
    );

    const data = await response.json();

    console.log(data);

    if(response.ok){

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "userName",
            data.name
        );

        alert(
            "Login Successful"
        );

        window.location.href =
        "dashboard.html";
    }
    else{

        alert(
            data.detail
        );
    }
}