// declarations
const modals: HTMLCollectionOf<Element> = document.getElementsByClassName("Modal");
const buttons: HTMLCollectionOf<Element> = document.getElementsByClassName("ModalTrigger");
const spans: HTMLCollectionOf<Element> = document.getElementsByClassName("ModalClose");

// modal open sequence
function openModal(index: number): void {
    (modals[index] as HTMLElement).style.display = "block";
}

// modal close sequence
function closeModal(index: number): void {
    (modals[index] as HTMLElement).style.display = "none";
}

// click event for opening modal
for (let i = 0; i < buttons.length; i++) {
    (buttons[i] as HTMLElement).onclick = function(e) {
        e.preventDefault();
        openModal(i);
    };
}

// click event for closing modal (X button)
for (let i = 0; i < spans.length; i++) {
    (spans[i] as HTMLElement).onclick = function(e) {
        e.preventDefault();
        closeModal(i);
    };
}

// click event for closing modal (dark background)
window.onclick = function(event) {
    for (let i = 0; i < modals.length; i++) {
        if (event.target === modals[i]) {
            closeModal(i);
        }
    }
};
