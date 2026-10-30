
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = usernameInput.value.trim();

    if (!username) {
        alert("Please enter a username.");
        return;
    }

    window.location.href = `Organizerview.html?username=${encodeURIComponent(username)}`;
});