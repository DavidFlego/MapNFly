
import { inputRatingStars } from './rating-star.js';
import { nextInputField, resetForms } from './navbar-forms.js';

// OPEN DROPDOWN NEW SESSION FORM
window.newSessionForm = function newSessionForm(e) {
    document.querySelector('#dd-new-form').style.display = 'block';
    const target = e.target;
    nextInputField();
    inputRatingStars();
    resetForms(target) // HERE WE ALSO MAKE FIRST INPUT VISIBLE AFTER 'CLICK' ON 'NEW SESSION'
}

// OPEN DROPDOWN SIGN UP FORM
window.newUser = function newUser(e) {
    document.querySelector('#dd-register-form').style.display = 'block';
    const target = e.target;
    nextInputField();
    resetForms(target) 
}

// OPEN DROPDOWN LOG IN FORM
window.logInUser = function logInUser(e) {
    document.querySelector('#dd-login-form').style.display = 'block';
    const target = e.target;
    nextInputField();
    resetForms(target) 
}

// TOGGLE DROPDOWN USER MENU
window.userNavToggle = function userNavToggle() {
    const dropdown = document.getElementById('dropdown-menu');
    dropdown.classList.toggle('user-menu__toggle');
}

// ADD ACTIVE CLASS to header links on click
const navbarLinks = document.querySelectorAll('.header a[class*="link"]');
navbarLinks.forEach(el => {
    el.addEventListener('click', () => {
        const current = document.getElementsByClassName("active");
        if (current.length > 0) {
            current[0].className = current[0].className.replace(" active", "");
        }
        el.className += " active";
    })
})

// CLOSE THE DROPDOWN USER MENU if the user clicks outside of it
// and REMOVE ACTIVE CLASS from header links
window.addEventListener("click", e => {
    if (!e.target.matches('.user-dropdown')) {
        const dropdown = document.getElementById('dropdown-menu');
        if (dropdown.classList.contains('user-menu__toggle')) {
            dropdown.classList.remove('user-menu__toggle');
        }
    }
    if ( !e.target.matches('.header a') ) {
        const navbarLinks = document.querySelectorAll('.header a[class*="link"]');
        navbarLinks.forEach(el => {
            el.classList.remove('active')
        })       
    }
});
