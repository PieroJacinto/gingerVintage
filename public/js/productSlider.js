function imageClick(imageNumber) {
    setTimeout(() => {
        //Find the slider element
        const sliderElement = document.getElementById('pgalleryModal');
        //Slide to he right image
        swiffyslider.slideTo(sliderElement, imageNumber);
        //Listen to slide end and set focus to the container to enable keyboard navigation
        swiffyslider.onSlideEnd(sliderElement, () => sliderElement.querySelector(".slider-container").focus());
    }, 300)
}

function thumbHover(imageNumber) {
    //Find the slider element
    const sliderElement = document.getElementById('pgallery');
    //Slide to he right image
    swiffyslider.slideTo(sliderElement, imageNumber)
}