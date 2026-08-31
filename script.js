/* =========================
   FORM ELEMENTS
========================= */

const forms = document.querySelectorAll(".form-container");
const switchButtons = document.querySelectorAll(".switch-button");

const loginForm = document.getElementById("login");
const signupForm = document.getElementById("signup");
const forgotForm = document.getElementById("forgot");

const dashboard = document.getElementById("dashboard");

const forgotButton = document.getElementById("forgotButton");
const logoutButton = document.getElementById("logoutButton");


/* =========================
   SHOW FORM
========================= */

function showForm(formId) {

    forms.forEach(form => {
        form.classList.remove("active");
    });

    dashboard.classList.remove("active");

    const selectedForm = document.getElementById(formId);

    if (selectedForm) {
        selectedForm.classList.add("active");
    }
}


/* =========================
   SWITCH BETWEEN FORMS
========================= */

switchButtons.forEach(button => {

    button.addEventListener("click", () => {

        const targetForm = button.dataset.form;

        showForm(targetForm);

    });

});


/* =========================
   FORGOT PASSWORD BUTTON
========================= */

forgotButton.addEventListener("click", () => {

    showForm("forgotForm");

});


/* =========================
   PASSWORD VISIBILITY
========================= */

const passwordButtons =
    document.querySelectorAll(".password-toggle");

passwordButtons.forEach(button => {

    button.addEventListener("click", () => {

        const targetId = button.dataset.target;

        const input = document.getElementById(targetId);

        if (input.type === "password") {

            input.type = "text";
            button.textContent = "🙈";

        } else {

            input.type = "password";
            button.textContent = "👁";

        }

    });

});


/* =========================
   PASSWORD STRENGTH
========================= */

const signupPassword =
    document.getElementById("signupPassword");

const strengthBar =
    document.querySelector(".strength-bar");

const strengthText =
    document.querySelector(".strength-text span");


signupPassword.addEventListener("input", () => {

    const password = signupPassword.value;

    let strength = 0;

    if (password.length >= 6)
        strength++;

    if (/[A-Z]/.test(password))
        strength++;

    if (/[0-9]/.test(password))
        strength++;

    if (/[^A-Za-z0-9]/.test(password))
        strength++;


    if (password.length === 0) {

        strengthBar.style.width = "0%";
        strengthText.textContent = "None";

    }

    else if (strength <= 1) {

        strengthBar.style.width = "25%";
        strengthText.textContent = "Weak";

    }

    else if (strength === 2) {

        strengthBar.style.width = "50%";
        strengthText.textContent = "Medium";

    }

    else if (strength === 3) {

        strengthBar.style.width = "75%";
        strengthText.textContent = "Strong";

    }

    else {

        strengthBar.style.width = "100%";
        strengthText.textContent = "Very Strong";

    }

});


/* =========================
   LOCAL STORAGE DATABASE
========================= */

function getUsers() {

    return JSON.parse(
        localStorage.getItem("users")
    ) || [];

}


function saveUsers(users) {

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

}


/* =========================
   SIGN UP
========================= */

signupForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const username =
        document.getElementById("signupUsername")
        .value.trim();

    const email =
        document.getElementById("signupEmail")
        .value.trim();

    const password =
        document.getElementById("signupPassword")
        .value;

    const confirmPassword =
        document.getElementById("confirmPassword")
        .value;


    if (password !== confirmPassword) {

        showToast(
            "Error",
            "Passwords do not match."
        );

        return;

    }


    if (password.length < 6) {

        showToast(
            "Error",
            "Password must contain at least 6 characters."
        );

        return;

    }


    const users = getUsers();


    const existingUser =
        users.find(
            user =>
                user.username.toLowerCase() ===
                username.toLowerCase()
        );


    if (existingUser) {

        showToast(
            "Error",
            "Username already exists."
        );

        return;

    }


    const existingEmail =
        users.find(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        );


    if (existingEmail) {

        showToast(
            "Error",
            "Email is already registered."
        );

        return;

    }


    users.push({
        username: username,
        email: email,
        password: password
    });


    saveUsers(users);


    signupForm.reset();

    strengthBar.style.width = "0%";
    strengthText.textContent = "None";


    showToast(
        "Account Created",
        "Your account has been created successfully."
    );


    setTimeout(() => {

        showForm("loginForm");

        document.getElementById("loginUsername").value =
            username;

    }, 1200);

});


/* =========================
   LOGIN
========================= */

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const username =
        document.getElementById("loginUsername")
        .value.trim();

    const password =
        document.getElementById("loginPassword")
        .value;


    const users = getUsers();


    const user =
        users.find(
            account =>
                account.username.toLowerCase() ===
                username.toLowerCase()
        );


    if (!user) {

        showToast(
            "Login Failed",
            "Username does not exist."
        );

        return;

    }


    if (user.password !== password) {

        showToast(
            "Login Failed",
            "Incorrect password."
        );

        return;

    }


    /* Successful Login */

    document.getElementById(
        "dashboardUsername"
    ).textContent = user.username;


    document.getElementById(
        "dashboardUser"
    ).textContent = user.username;


    document.getElementById(
        "dashboardEmail"
    ).textContent = user.email;


    document.getElementById(
        "userAvatar"
    ).textContent =
        user.username.charAt(0).toUpperCase();


    forms.forEach(form => {
        form.classList.remove("active");
    });


    dashboard.classList.add("active");


    showToast(
        "Login Successful",
        `Welcome back, ${user.username}!`
    );

});


/* =========================
   FORGOT PASSWORD
========================= */

forgotForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const username =
        document.getElementById("forgotUsername")
        .value.trim();

    const email =
        document.getElementById("forgotEmail")
        .value.trim();


    const users = getUsers();


    const user =
        users.find(
            account =>
                account.username.toLowerCase() ===
                username.toLowerCase() &&
                account.email.toLowerCase() ===
                email.toLowerCase()
        );


    if (!user) {

        showToast(
            "Account Not Found",
            "Username and email do not match."
        );

        return;

    }


    /*
       DEMO ONLY

       Real websites should NOT display
       passwords like this.
    */

    showToast(
        "Account Found",
        `Demo password: ${user.password}`
    );

});


/* =========================
   LOGOUT
========================= */

logoutButton.addEventListener("click", () => {

    dashboard.classList.remove("active");

    showForm("loginForm");

    loginForm.reset();

    showToast(
        "Logged Out",
        "You have been logged out successfully."
    );

});


/* =========================
   TOAST SYSTEM
========================= */

const toast =
    document.getElementById("toast");

const toastTitle =
    document.getElementById("toastTitle");

const toastMessage =
    document.getElementById("toastMessage");

const closeToast =
    document.getElementById("closeToast");


let toastTimer;


function showToast(title, message) {

    toastTitle.textContent = title;

    toastMessage.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 4000);

}


closeToast.addEventListener("click", () => {

    toast.classList.remove("show");

});
