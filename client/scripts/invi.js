const bell = document.querySelector(".bell-icon");
const notificationPanel = document.querySelector(".notificationpanel");

bell.addEventListener("click", function () {

    notificationPanel.classList.toggle("show");

});