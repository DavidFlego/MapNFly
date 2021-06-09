// import { inputRatingStars } from './rating-star.js';
// import { toInnactive, toActive, nextInput, resetForm } from './navbar-forms.js';

// window.newSessionForm = function newSessionForm() {

//     const form = document.querySelector('.dd-form');
//     const formInputs = document.querySelectorAll('.dd__input');
//     const btnSubmit = document.querySelector('.dd-submit');
//     const successMsg = document.querySelector('.dd-success');

//     form.addEventListener('submit', e => {
//         e.preventDefault();
//         toInnactive(btnSubmit);
//         // validation
//         // if (...all ok..) {
//             toActive(successMsg);  // show success msg
//             setTimeout(() => form.submit(), 3000 );
//         // }
//     })

//     formInputs.forEach(input => {
//         const parent = input.parentElement;
//         const nextForm = parent.nextElementSibling;

//         input.addEventListener('keypress', e => {            
//             // Check to see if ENTER was pressed and the submit button was active or not
//             if (e.key === 'Enter' && e.target === btnSubmit) {
//                 // Submit button was 'clicked' | show success msg and then submit the form
                
//             } else if (e.key === 'Enter' && input.value.length > 0 && e.target !== btnSubmit) {  /* VALIDATION STILL MISSING */
//                 // Cancel form's submit event
//                 e.preventDefault();

//                 // Invoke click event of target so that non-form submit behaviors will work
//                 e.target.click();
                
//                 // Set active/innactive styles on next form input
//                 nextInput(parent, nextForm);
//             } 
//         }); 
//     });
//     inputRatingStars();
//     resetForm() // HERE WE ALSO MAKE FIRST INPUT VISIBLE AFTER 'CLICK' ON 'NEW SESSION'
// }