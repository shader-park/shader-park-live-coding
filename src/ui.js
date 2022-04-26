const toggleButton = (className, callback) => {
    let button = document.querySelector(className);
    button.addEventListener('click', (el) => {
        if(button.classList.contains('active')) {
            button.classList.remove('active');
            callback(true);
        } else {
            button.classList.add('active');
            callback(false);
        }
    }, false);
}

const createPermaLink = (state) => {
    let button = document.querySelector('.permalink');

    
    button.addEventListener('click', () => {
        let urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.set('bufferA', encodeURI(state.bufferA));
        urlSearchParams.set('bufferB', encodeURI(state.bufferB));
        urlSearchParams.set('bufferC', encodeURI(state.bufferC));
        urlSearchParams.set('bufferD', encodeURI(state.bufferD));
        urlSearchParams.set('common', encodeURI(state.common));
        urlSearchParams.set('finalImage', encodeURI(state.finalImage));
        window.location.search = urlSearchParams.toString();
    }, false);
}

const showHideButtonInteraction = () => {
    let codeContainer = document.querySelector('.code-container');
    let logo = document.querySelector('.logo');
    let permalink = document.querySelector('.permalink');
    let elements = [codeContainer, logo];
    
    let showHideButton = document.querySelector('.show-hide-editor');
    toggleButton('.show-hide-editor', (active) => {
        if(active) {
            showHideButton.innerHTML= 'Hide Code';
            elements.forEach(el => el.style.display = 'block');
        } else {
            showHideButton.innerHTML= 'Show Code';
            elements.forEach(el => el.style.display = 'none');
        }
    });
    // showHideButton.addEventListener('click', (el) => {
    //     if(showHideButton.classList.contains('show')) {
    //         showHideButton.classList.remove('show');
    //         showHideButton.innerHTML= '>';
    //         codeContainer.style.display = 'block';
    //     } else {
    //         showHideButton.classList.add('show')
    //         showHideButton.innerHTML= '^';
    //         codeContainer.style.display = 'none';
    //     }
    // }, false);
}

export const initUIInteractions = (state) => {
    // showHideButtonInteraction();
    createPermaLink(state);
}