// declarations
let modals = document.getElementsByClassName("Modal");
let buttons = document.getElementsByClassName("ModalTrigger");
let spans = document.getElementsByClassName("ModalClose");


// modal open sequence
function openModal(index, trigger) {
        modals[0].style.display = "block";

        const title = trigger.getAttribute('title')
        let modalTitle = document.querySelector('.ModalContent h2');
        modalTitle.textContent = title;

        const multiverseid = trigger.getAttribute('value');
        let modalImg = document.querySelector('.Modal img');
        modalImg.src = `http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${multiverseid}&type=card`;
        


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

