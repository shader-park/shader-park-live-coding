let response = await fetch("./filePaths1.json");
let filePaths = await response.json();
let container = document.querySelector('.container');

filePaths.forEach(file => {
    let a = document.createElement('a');
    a.target = "_blank";
    a.href = `http://localhost:1234/?hash=${file.substr(7, file.length - 11)}`
    let img = document.createElement('img');
    img.src = file;
    img.classList.add('imgs');
    a.appendChild(img);
    container.appendChild(a);
});
let images = document.querySelectorAll('.imgs');
let slider = document.querySelector('.slider');

slider.addEventListener('input', (el) => {
    let val = parseInt(el.target.value);
    document.querySelector('.slider-value').innerHTML = val + ' columns';
});

slider.addEventListener('mouseup', (el) => {
    let val = parseInt(el.target.value);
    document.querySelector('.slider-value').innerHTML = val + ' columns';
    resizeImages(val);
    container.style.columnCount = val;
});

function resizeImages(gridNum) {
    console.log((window.innerWidth / gridNum - 10) + 'px');
    images.forEach(img => {
        img.style.width = (window.innerWidth / gridNum - 10) + 'px';
        img.style.height = (window.innerWidth / gridNum - 10) + 'px';
    })
}

window.addEventListener('resize', () => {
    console.log('slider val', slider.value);
    resizeImages(parseInt(slider.value));
});