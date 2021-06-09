
function closeAlert() {
    const el = document.querySelector('.alert');
    el.style.display = 'none';
}

// Close flash msg after 7seconds
window.setTimeout("document.querySelector('.alert').classList.add('alert-fade')", 7000);