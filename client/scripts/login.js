
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const username = usernameInput.value.trim();
    //暂存目前的用户
    localStorage.setItem("currentUser", username);
    window.location.href = "Organizerview.html";
});