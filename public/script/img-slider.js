let slideIndex = 1;
showSlides(slideIndex);

window.nextImg = function nextImg(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    var slides = document.getElementsByClassName("card--img");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndex - 1].style.display = "flex";

}

// https://stackoverflow.com/questions/61205573/image-slider-onclick-button-javascript