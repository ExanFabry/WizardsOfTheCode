// declarations
let decksArr = ["Azorius", "Orzhov", "Dimir", "Rakdos" ];
let modals = document.getElementsByClassName("Modal");
let buttons = document.getElementsByClassName("ModalTrigger");
let spans = document.getElementsByClassName("ModalClose");
let triggerNewDeck = document.getElementById("TriggerNewDeck");
let modalNewDeck = document.getElementsByClassName("ModalNewDeck");

// modal open sequence
function openModal(index, trigger) {
    if (index === -1) {
        modalNewDeck[0].style.display = "block";
    } 
    else {
        const title = trigger.getAttribute('title');
        modals[0].style.display = "block";
        let modalImg = document.querySelector('.Modal img');
        modalImg.src = trigger.querySelector('img').src;
        let modalTitle = document.querySelector('.ModalContent h2');
        modalTitle.textContent = title;
        let modalValue = document.querySelector('.ModalContent form input[name="nameEdit"]');
        modalValue.value = title;
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
        openModal(i, buttons[i]);
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
triggerNewDeck.onclick = function(e) {
    e.preventDefault();
    openModal(-1);
};


document.querySelectorAll('.DecksChangeNameBtn').forEach(btn => {
    btn.addEventListener('click', function() {
        const form = this.nextElementSibling;
        const input = form.querySelector('.DecksNewDeckInput');
        const saveBtn = form.querySelector('.DecksSaveBtn');
        const deleteForm = this.parentElement.querySelector('.DecksDeleteForm');

        input.style.display = input.style.display === 'none' ? 'block' : 'none';
        saveBtn.style.display = saveBtn.style.display === 'none' ? 'block' : 'none';
        deleteForm.style.display = deleteForm.style.display === 'none' ? 'block' : 'none';
    });
});

document.querySelectorAll('.DecksDeleteBtn').forEach(btn => {
    btn.addEventListener('click', function() {
        const deleteForm = this.parentElement;
        const deleteConfirmation = deleteForm.querySelector('.DeleteConfirmation');

        deleteConfirmation.style.display = deleteConfirmation.style.display === 'none' ? 'block' : 'none';
    });
});

document.querySelectorAll('.DecksConfirmDeleteBtn').forEach(btn => {
    btn.addEventListener('click', function() {
        const deleteForm = this.closest('.DecksDeleteForm');
        deleteForm.submit();
    });
});

document.querySelectorAll('.DecksCancelDeleteBtn').forEach(btn => {
    btn.addEventListener('click', function() {
        const deleteForm = this.closest('.DecksDeleteForm');
        const deleteConfirmation = deleteForm.querySelector('.DeleteConfirmation');
        deleteConfirmation.style.display = 'none';
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const backgroundUrlField = document.getElementById("backgroundUrl");
    const toggleBackgroundUrlLabel = document.getElementById("toggleBackgroundUrl");

    toggleBackgroundUrlLabel.addEventListener("click", function() {
        // Toggle de weergave van het veld voor de achtergrond-URL
        backgroundUrlField.style.display = backgroundUrlField.style.display === "none" ? "inline" : "none";
    });
});





