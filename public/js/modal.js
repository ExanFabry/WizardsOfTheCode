// declarations
let modals = document.getElementsByClassName("Modal");
let buttons = document.getElementsByClassName("ModalTrigger");
let spans = document.getElementsByClassName("ModalClose");

let triggerNewDeck = document.getElementById("TriggerNewDeck");
let modalNewDeck = document.getElementsByClassName("ModalNewDeck");

// modal open sequence
function openModal(index) {
    if (index === -1) {
        modalNewDeck[0].style.display = "block";
    } else {
        modals[0].style.display = "block";
        

        let dataIndexElement = document.querySelector('.Modal'); 
        dataIndexElement.setAttribute('dataIndex', index);
        
        let modalImg = document.querySelector('.Modal img');
        modalImg.src = `assets/images/deck${index+1}.jpg`;
    
        let modalLabel = document.querySelector('.Modal label[for="img"]');
        modalLabel.textContent = "<%= decksArr["+index+"] %>";
        
        let hiddenInput = document.querySelector('input[type="hidden"][name="name"]');
        hiddenInput.value = "<%= decksArr[" + index + "] %>";
        


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

triggerNewDeck.onclick = function(e) {
    e.preventDefault();
    openModal(-1);
};