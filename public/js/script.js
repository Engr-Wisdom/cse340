const passwordBtn = document.getElementById("passwordBtn")

passwordBtn.addEventListener("click", () => {
    const password = document.getElementById("password")
    const type = password.getAttribute("type");

    if (type === "password") {
        password.setAttribute("type", "text")
        passwordBtn.textContent = "Hide Password"
    } else {
        password.setAttribute("type", "password")
        passwordBtn.textContent = "Show Password"
    }
})