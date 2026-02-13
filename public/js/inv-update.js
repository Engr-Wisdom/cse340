const form = document.getElementById("updateForm")

form.addEventListener("click", () => {
    const updateBtn = document.querySelector("button")
    updateBtn.removeAttribute("disabled")
})