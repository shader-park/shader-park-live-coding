const showHideButtonInteraction = () => {
    let codeContainer = document.querySelector('.code-container');
    let showHideButton = document.querySelector('.show-hide-editor');
    showHideButton.addEventListener('click', (el) => {
    if(showHideButton.classList.contains('show')) {
        showHideButton.classList.remove('show');
        showHideButton.innerHTML= '>';
        codeContainer.style.display = 'block';
    } else {
        showHideButton.classList.add('show')
        showHideButton.innerHTML= '^';
        codeContainer.style.display = 'none';
    }
    }, false);
}

export const initUIInteractions = () => {
    showHideButtonInteraction();
}