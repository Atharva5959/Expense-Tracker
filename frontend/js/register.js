async function registerUser(){

    const name =
    document.getElementById(
        "name"
    ).value;

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
        "http://127.0.0.1:8000/register",
        {
            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({
                name:name,
                email:email,
                password:password
            })
        }
    );

    const data =
    await response.json();

    alert(data.message);

    window.location.href =
    "login.html";
}