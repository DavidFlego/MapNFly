
import { nextInput } from './navbar-forms.js';

export function inputRatingStars() {

    const ratingStarInput = document.querySelectorAll('.dd-rating__input');

    ratingStarInput.forEach( starInput => {
        const parent = starInput.parentElement.parentElement;
        const nextForm = parent.nextElementSibling;

        starInput.addEventListener('click', (e) => {
            //e.preventDefault();
            e.stopPropagation();
            // Remove checked attribute from first(none / 0 stars) input
            ratingStarInput[0].removeAttribute('checked');

            // Set checked attribute to clicked input
            starInput.setAttribute('checked', '');

            // Set active/innactive styles on next form input
            nextInput(parent, nextForm);  
        })

        starInput.addEventListener('keypress', (e) => {
            if ( e.key == 'Enter' && starInput.hasAttribute('checked') ) {
                // Cancel form's submit event
                e.preventDefault();
                // Set active/innactive styles on next form input
                nextInput(parent, nextForm);  
            }
        })
    })
}

// resets CHECKED input for rating star
export function resetRatingStars() {
    const ratingStarInput = document.querySelectorAll('.dd-rating__input');
    ratingStarInput.forEach( (input, index) => {
        input.removeAttribute('checked');
        if (index === 0) {
            input.setAttribute('checked', '');
        }
    }) 
    //ratingStarInput[0].setAttribute('checked', '');

    // in navbar-forms.js we are setting input.value = ''; but we don´t want rating input value of ''
    document.querySelector('.dd-rating__input--none').value = 0;
}
