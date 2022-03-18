const modal = document.getElementById("modal");
const closeBttn = document.querySelector(".close");
function showModal() {
    modal.style.display = "block";
}

function hideModal() {
    modal.style.display = "none";
}

closeBttn.addEventListener("click", e => {
    modal.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", event => {
    if (event.target == modal) {
        hideModal();
    }
});