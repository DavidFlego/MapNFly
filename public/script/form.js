const file = document.querySelector('.file__input');
file.addEventListener('change', (e) => {
    // If I want to display names of files
    // let showFiles = [];
    // Array.from(e.target.files).forEach(el => {
    //     showFiles.push(el.name);
    // });
   
    document.querySelector('.file__name').textContent = `${e.target.files.length} files selected`;
});

const file2 = document.querySelector('.dd__file-input');
file2.addEventListener('change', (e) => {
    // If I want to display names of files
    // let showFiles = [];
    // Array.from(e.target.files).forEach(el => {
    //     showFiles.push(el.name);
    // });
    
    console.log(e.target.files)
    document.querySelector('.dd__file-name').textContent = `${e.target.files.length} files selected`;
});

const form = document.querySelector('.form');
const title = document.getElementById('title');
const formInput = document.querySelectorAll('.form__input--required');

form.addEventListener('submit', (e) => {
    // e.preventDefault();
    checkInput(e);
});

function checkInput(e) {
    formInput.forEach((input, i) => {
        const inputValue = input.getAttribute('placeholder');
        if ( input.value.trim() === '' ) {
            e.preventDefault();
            setError(input, `${inputValue} cannot be empty`)
        } else {
            formInput[i + 1].focus();
            setSuccess(input)
        }
    })
}

function setError(input, message) {
    const formControl = input.parentElement;
    const errorMsgControl = formControl.querySelector('.error-msg');

    // Add error msg inside .error-msg
    errorMsgControl.innerText = message;

    // Toggle error/success classes
    formControl.classList.remove('success');
    formControl.classList.add('error');
}

function setSuccess(input) {
    const formControl = input.parentElement;

    // Toggle error/success classes
    formControl.classList.remove('error');
    formControl.classList.add('success');
}