import { StateEffect } from "@codemirror/state";

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

let showHideButtonInteraction = (codeContainerClass, hideButtonClass) => {
    let codeContainer = document.querySelector(codeContainerClass);
    let showHideButton = document.querySelector(hideButtonClass);
    let elements = [codeContainer];
    toggleButton(hideButtonClass, (active) => {
        if(active) {
            showHideButton.innerHTML= 'Hide Code';
            elements.forEach(el => el.style.display = 'block');
        } else {
            showHideButton.innerHTML= 'Show Code';
            elements.forEach(el => el.style.display = 'none');
        }
    });
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

let watchCompileButton = (state, className) => {
    let compile = document.querySelector(className);
    compile.addEventListener('click', () => {
        if(state.player !== 'main') {
            console.log(state.webSocket);
            state.webSocket.send(JSON.stringify({'sender': state.player, 'compile': true}))
            if(state.player === 'player1') {
                state.mixedCode = window.editor.state.doc.toString() + '\n let mixAmt = input();'
            } else if (state.player === 'player2') {
                state.mixedCode = window.editor2.state.doc.toString() + '\n let mixAmt = input();'
            }
            compileShader();
        } else {
            state.code = window.editor.state.doc.toString()
            state.code2 = window.editor2.state.doc.toString()
            window.blendCode();
            window.compileShader();
        }

    }, false);
}

export const initUIInteractions = (state, params) => {
    showHideButtonInteraction('.code-container', '.show-hide-editor');
    showHideButtonInteraction('.code-container2', '.show-hide-editor2');
    createPermaLink1(state);
    createPermaLink2(state);
    watchSlider(params);
    watchCSGModes(state);
    watchCompileButton(state, '.compile')
    watchCompileButton(state, '.compile2');
    // createPermaLink('.permalink', 'code', state.code);
    // createPermaLink('.permalink2', 'code2', state.code2);
}