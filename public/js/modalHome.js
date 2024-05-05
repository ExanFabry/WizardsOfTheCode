// declarations
let modals = document.getElementsByClassName("Modal");
let buttons = document.getElementsByClassName("ModalTrigger");
let spans = document.getElementsByClassName("ModalClose");


// modal open sequence
function openModal(index, trigger) {
        modals[0].style.display = "block";

        const title = trigger.getAttribute('title')
        const multiverseid = trigger.getAttribute('value');
        const type = trigger.getAttribute('type');
        const rarity = trigger.getAttribute('rarity');
        populateModal(title, multiverseid, type, rarity)
}

// populate modal
function populateModal(title, multiverseid, type, rarity) {

    const modalfigure = document.getElementById('ModalFigure');
    modalfigure.innerHTML = `
        <img src="http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${multiverseid}&type=card" alt="Card">`;

    const modalContent = document.getElementById('ModalSection');
    modalContent.innerHTML = `
        <h2>Name&colon;</h2>
        <p>${title}</p>
        <h2>Type&colon;</h2>
        <p>${type}</p>
        <h2>Rarity&colon;</h2>
        <h2>${rarity}</h2>`;

        const modalFormContent = document.getElementById('ModalForm');
        modalFormContent.value = title;
        const modalFormContent2 = document.getElementById('ModalForm2');
        modalFormContent2.value = multiverseid;
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

