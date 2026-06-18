const API_URL =
"https://expense-tracker-o3jp.onrender.com";

async function login() {

    const email =
    document.getElementById(
        "email"
    ).value;

    const password =
    document.getElementById(
        "password"
    ).value;

    try {

        const response =
        await fetch(
            `${API_URL}/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data =
        await response.json();

        console.log(data);

        if (response.ok) {

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
            "/dashboard-page";

        } else {

            alert(
                data.detail ||
                "Login Failed"
            );

        }

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server"
        );

    }
}