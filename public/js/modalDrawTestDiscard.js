// Declarations
let modalsDiscard = document.getElementsByClassName("DiscardModal");
let buttonsDiscard = document.getElementsByClassName("ModalTriggerDiscard");
let spansDiscard = document.getElementsByClassName("ModalCloseDiscard");

// Function to handle opening a modal
function openModal(index) {
    console.log("Discard");
    modalsDiscard[index].style.display = "block";
}

// Function to handle closing a modal
function closeModal(index) {
    modalsDiscard[index].style.display = "none";
}

// Assign click event listeners to buttons to open corresponding modals
for (let i = 0; i < buttonsDiscard.length; i++) {
    buttonsDiscard[i].onclick = function(e) {
        e.preventDefault();
        openModal(i);
    };
}

// Assign click event listeners to spans to close corresponding modals
for (let i = 0; i < spansDiscard.length; i++) {
    spansDiscard[i].onclick = function(e) {
        e.preventDefault();
        closeModal(i);
    };
}

// Function to handle clicking on the dark background to close modals
window.onclick = function(event) {
    for (let i = 0; i < modalsDiscard.length; i++) {
        if (event.target == modalsDiscard[i]) {
            closeModal(i);
        }
    }
};