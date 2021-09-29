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
        window.prompt('code', decodeURI(state.code));
        console.log(decodeURI(state.code));
    }, false);
}

const showHideButtonInteraction = () => {
    let codeContainer = document.querySelector('.code-container');
    let showHideButton = document.querySelector('.show-hide-editor');
    toggleButton('.show-hide-editor', (active) => {
        if(active) {
            showHideButton.innerHTML= '>';
            codeContainer.style.display = 'block';
        } else {
            showHideButton.innerHTML= '^';
            codeContainer.style.display = 'none';
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
    showHideButtonInteraction();
    createPermaLink(state);
}