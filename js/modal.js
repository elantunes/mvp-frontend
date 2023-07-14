window.onclick = function(event) {
    if (event.target.classList.contains('modal'))
        event.target.style.display = 'none';
}

document.querySelector('.modal .close').onclick = function(event) {
    event.target.closest('.modal').style.display='none';
}

function closeModal(modal) {
    modal.style.display = 'none';
}