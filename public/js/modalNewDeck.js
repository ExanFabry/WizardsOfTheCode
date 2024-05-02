// declarations
let decksArr = ["Azorius", "Orzhov", "Dimir", "Rakdos" ];

let modals = document.getElementsByClassName("Modal");
let buttons = document.getElementsByClassName("ModalTrigger");
let spans = document.getElementsByClassName("ModalClose");

let trigger2 = document.getElementById("Trigger2");

// modal open sequence
function openModal(index) {
    if (index === -1) {
        modals[0].style.display = "block";
    } 
    else {
        modals[0].style.display = "block";
        let modalImg = document.querySelector('.Modal img');
        modalImg.src = `assets/images/deck${index+1}.jpg`;
    
        let modalTitle = document.querySelector('.ModalContent h2');
        modalTitle.textContent = decksArr[index];
                
        let hiddenInput = document.querySelector('input[type="hidden"][name="name"]');
        hiddenInput.value = decksArr[index];
    }
}
// modal close sequence
function closeModal(index) {
    modals[index].style.display = "none";
}
// click event for opening modal
for (let i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function(e) {
        e.preventDefault();
        openModal(i);
    };
}
// click event for closing modal (X button)
for (let i = 0; i < spans.length; i++) {
    spans[i].onclick = function(e) {
        e.preventDefault();
        closeModal(i);
    };
}
// click event for closing modal (dark background)
window.onclick = function(event) {
    for (let i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            closeModal(i);
        }
    }
};

trigger2.onclick = function(e) {
    e.preventDefault();
    openModal(-1);
};
