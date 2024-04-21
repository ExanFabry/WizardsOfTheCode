// Declarations
let modals = document.getElementsByClassName("Modal");
let modals2 = document.getElementById("Modal2");
let buttons = document.getElementsByClassName("ModalTrigger");
let buttons2 = document.getElementsByClassName("ModalTrigger2");
let spans = document.getElementsByClassName("ModalClose");
let spans2 = document.getElementById("ModalClose2");


// Function to handle opening a modal
function openModal2(index) {
    modals2.style.display = "block";
}

// Function to handle closing a modal
function closeModal2(index) {
    modals2.style.display = "none";
}

// Assign click event listeners to buttons to open corresponding modals
for (let i = 0; i < buttons2.length; i++) {
    buttons2[i].onclick = function(e) {
        e.preventDefault();
        openModal2(i);
    };
}

// Assign click event listeners to spans to close corresponding modals
for (let i = 0; i < spans2.length; i++) {
    spans2[i].onclick = function(e) {
        e.preventDefault();
        closeModal2(i);
    };
}

// Function to handle clicking on the dark background to close modals
window.onclick = function(event) {
    for (let i = 0; i < modals2.length; i++) {
        if (event.target == modals2[i]) {
            closeModal2(i);
        }
    }
};



// Function to handle opening a modal
function openModal(index) {
    modals[index].style.display = "block";
}

// Function to handle closing a modal
function closeModal(index) {
    modals[index].style.display = "none";
}

// Assign click event listeners to buttons to open corresponding modals
for (let i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function(e) {
        e.preventDefault();
        openModal(i);
    };
}

// Assign click event listeners to spans to close corresponding modals
for (let i = 0; i < spans.length; i++) {
    spans[i].onclick = function(e) {
        e.preventDefault();
        closeModal(i);
    };
}

// Function to handle clicking on the dark background to close modals
window.onclick = function(event) {
    for (let i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            closeModal(i);
        }
    }
};