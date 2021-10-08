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

const createPermaLink = (className, queryParam, currCode) => {
    let button = document.querySelector(className);
    button.addEventListener('click', () => {
        let urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.set(queryParam, encodeURI(currCode));
        window.location.search = urlSearchParams.toString();
    }, false);
}

const createPermaLink1 = (state) => {
    let button = document.querySelector('.permalink');
    button.addEventListener('click', () => {
        let urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.set('code', encodeURI(state.code));
        window.location.search = urlSearchParams.toString();
    }, false);
}

const createPermaLink2 = (state) => {
    let button = document.querySelector('.permalink2');
    button.addEventListener('click', () => {
        let urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.set('code2', encodeURI(state.code2));
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

let watchSlider = (params) => {
    let slider = document.querySelector('.slider');
    slider.addEventListener('input', () => {
        params.mixAmt = 1.0-slider.value;
    }, false);
}

let watchCSGModes = (state) => {
    let select = document.querySelector('.csgModes');
    select.addEventListener('change', () => {
        state.csgMode = select.value;
        window.blendCode();
        window.compileShader();
    }, false);
}

export const initUIInteractions = (state, params) => {
    showHideButtonInteraction();
    createPermaLink1(state);
    createPermaLink2(state);
    watchSlider(params);
    watchCSGModes(state);
    // createPermaLink('.permalink', 'code', state.code);
    // createPermaLink('.permalink2', 'code2', state.code2);
}