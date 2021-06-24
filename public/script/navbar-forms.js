
import { resetRatingStars } from './rating-star.js';

export function nextInputField() {
    const formInputs = document.querySelectorAll('.dd__input');
    const btnSubmit = document.querySelector('.dd-submit');
    const nextInputArrows = document.querySelectorAll('.dd-next');

    nextInputArrows.forEach(arrow => {
        const parent = arrow.parentElement;
        const nextForm = parent.nextElementSibling;

        arrow.addEventListener('click', e => {
            if ( parent.querySelector('.dd__file-input') ) {
                nextInput(parent, nextForm);
            } else if ( parent.querySelector('.dd__input').value != '' ) {
                // Set active/innactive styles on next form input
                nextInput(parent, nextForm);
            }
        })
    })
    
    formInputs.forEach(input => {
        const parent = input.parentElement;
        const nextForm = parent.nextElementSibling;
        
        // Event listener on Enter keypress
        input.addEventListener('keypress', e => {            
            // Check to see if ENTER was pressed and the submit button was active or not
            if (e.key === 'Enter' && e.target === btnSubmit) {
                // Submit button was 'clicked' | show success msg and then submit the form 
            } else if (e.key === 'Enter' && e.target !== btnSubmit && input.value != '') {  /* VALIDATION STILL MISSING */
                // Cancel form's submit event
                 e.preventDefault();

                // Invoke click event of target so that non-form submit behaviors will work
                //  e.target.click();
                
                // Set active/innactive styles on next form input
                nextInput(parent, nextForm);
            } 
        }); 
    });
}

// Form input is ACTIVE
export function toActive(el) {
    el.classList.remove('innactive');
    el.classList.add('active');
}

// Form input is INNACTIVE
export function toInnactive(el) {
    el.classList.remove('active');
    el.classList.add('innactive');
}

// SHOW NEXT INPUT AND HIDE CURRENT INPUT
export function nextInput(parent, nextFormInput) {
    toInnactive(parent);
    toActive(nextFormInput);
    // Sets focus on next form input
    nextFormInput.querySelector('.dd__in').focus();
}

// RESET DROPDOWN FORM AND FOCUS
export function resetForms(target) {

    const allFormsInput = document.querySelectorAll('.dd__in');
    allFormsInput.forEach((input, i) => {
            toInnactive(input.parentElement);
    })

    let formInputs;
    if ( target.classList.contains('navbar__link--new') ) {
        formInputs = document.querySelectorAll('.new-ses__input');
    } else if ( target.classList.contains('signup-user') ) {
        formInputs = document.querySelectorAll('.register__input');
    } else if ( target.classList.contains('login-user') ) {
        formInputs = document.querySelectorAll('.login__input');
    }
    
    formInputs.forEach((input, i) => {
        const parent = input.parentElement;
        const parentStars = input.parentElement.parentElement; // must target parent.parent of star element

        input.value = '';

        if (i > 0) {
            toInnactive(parent);
            toInnactive(parentStars);  
        } else {
            // Add focus and active state on first input element
            input.focus();
            toActive(parent);  // HERE WE ALSO MAKE FIRST INPUT VISIBLE
        }
    })

    resetRatingStars()
}

// CLOSE THE DROPDOWN FORMs
window.addEventListener('click', e => {
    const formGroups = document.querySelectorAll('.dd-group');
    formGroups.forEach(group => {
        if (!e.target.matches('.navbar__link--new') &&
            !e.target.matches('.dd__in') && 
            !e.target.matches('.dd-rating__label') &&
            !e.target.matches('.signup-user') &&
            !e.target.matches('.login-user') &&
            !e.target.matches('.dd__input--label') &&
            !e.target.matches('.fa-angle-right')) { // image file input
            
            // Sets all inputs to innactive
            toInnactive(group);
            
            // Clears the input value | Form is invalid and cannot be accidentally submited
            const formInputs = document.querySelectorAll('.dd__input');
            formInputs.forEach(input => {
                input.value = '';
            })

            document.querySelector('.dd__file-name').textContent = '';

            // resets checked input for rating star
            resetRatingStars()
        }
    })
})

