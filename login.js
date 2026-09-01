// ============================================
// LUX AI LOGIN
// ============================================


// ============================================
// ELEMENTS
// ============================================

const loginForm =
    document.getElementById("loginForm");

const loginUser =
    document.getElementById("loginUser");

const loginPassword =
    document.getElementById("loginPassword");

const togglePassword =
    document.getElementById("togglePassword");

const rememberMe =
    document.getElementById("rememberMe");

const guestBtn =
    document.getElementById("guestBtn");

const signupBtn =
    document.getElementById("signupBtn");

const signupModal =
    document.getElementById("signupModal");

const closeSignup =
    document.getElementById("closeSignup");

const signupForm =
    document.getElementById("signupForm");

const forgotBtn =
    document.getElementById("forgotBtn");


// ============================================
// PASSWORD SHOW / HIDE
// ============================================

togglePassword.addEventListener(
    "click",
    function () {

        if (
            loginPassword.type ===
            "password"
        ) {

            loginPassword.type =
                "text";

            togglePassword.textContent =
                "🙈";

        } else {

            loginPassword.type =
                "password";

            togglePassword.textContent =
                "👁";
        }
    }
);


// ============================================
// LOGIN
// ============================================

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const username =
            loginUser.value.trim();

        const password =
            loginPassword.value;


        if (
            username === "" ||
            password === ""
        ) {

            alert(
                "Please enter username and password."
            );

            return;
        }


        /*
         * Demo local login.
         *
         * This is not real secure authentication.
         * Credentials are stored locally.
         */


        const account =
            JSON.parse(
                localStorage.getItem(
                    "luxAccount"
                )
            );


        if (!account) {

            alert(
                "No LUX AI account found. Please create an account or continue as Guest."
            );

            return;
        }


        if (
            (
                username === account.email ||
                username === account.username
            ) &&
            password === account.password
        ) {

            localStorage.setItem(
                "luxLoggedIn",
                "true"
            );


            if (
                rememberMe.checked
            ) {

                localStorage.setItem(
                    "luxRemember",
                    "true"
                );
            }


            window.location.href =
                "index.html";

        } else {

            alert(
                "Invalid username or password."
            );
        }
    }
);


// ============================================
// GUEST
// ============================================

guestBtn.addEventListener(
    "click",
    function () {

        localStorage.setItem(
            "luxGuest",
            "true"
        );


        window.location.href =
            "index.html";
    }
);


// ============================================
// OPEN SIGNUP
// ============================================

signupBtn.addEventListener(
    "click",
    function () {

        signupModal.classList.add(
            "active"
        );
    }
);


// ============================================
// CLOSE SIGNUP
// ============================================

closeSignup.addEventListener(
    "click",
    function () {

        signupModal.classList.remove(
            "active"
        );
    }
);


// ============================================
// CLICK OUTSIDE
// ============================================

signupModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === signupModal
        ) {

            signupModal.classList.remove(
                "active"
            );
        }
    }
);


// ============================================
// CREATE ACCOUNT
// ============================================

signupForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "signupName"
            ).value.trim();


        const email =
            document.getElementById(
                "signupEmail"
            ).value.trim();


        const password =
            document.getElementById(
                "signupPassword"
            ).value;


        if (
            !name ||
            !email ||
            !password
        ) {

            alert(
                "Please fill all fields."
            );

            return;
        }


        if (
            password.length < 4
        ) {

            alert(
                "Password must contain at least 4 characters."
            );

            return;
        }


        const username =
            email.split("@")[0];


        const account = {

            name:
                name,

            email:
                email,

            username:
                username,

            password:
                password
        };


        localStorage.setItem(
            "luxAccount",
            JSON.stringify(
                account
            )
        );


        alert(
            "LUX AI account created successfully!"
        );


        signupModal.classList.remove(
            "active"
        );


        loginUser.value =
            email;


        loginPassword.value =
            password;
    }
);


// ============================================
// FORGOT PASSWORD
// ============================================

forgotBtn.addEventListener(
    "click",
    function () {

        alert(
            "For this local demo, create a new account to reset your password."
        );
    }
);