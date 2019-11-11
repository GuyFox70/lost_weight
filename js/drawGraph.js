(function() {
    let content = document.querySelector('.content');
    let form = content.querySelector('.content-canvas-form');
    let input = form.querySelector('.content-canvas-form--inputWeight');
    let submit = form.querySelector('.content-canvas-form--inputSubmit');
    let cancel =  form.querySelector('.content-canvas-form--inputCancel');
    let elements = content.querySelectorAll('.date, .weight');

    let date = new Date();
    let data = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

    if (getFromLocalStorage('today') == data) {
        showElement(cancel, submit);
    } else {
        hiddenElement(cancel, submit);
        showText(elements);
    }

    const arrMonths = {
                        0: 'January', 1: 'February', 2: 'Match', 3: 'April',
                        4: 'May', 5: 'June', 6: 'July', 7: 'August',
                        8: 'September', 9: 'October', 10: 'November', 11: 'December'
                    };

    window.months = arrMonths;

    let canvas = document.querySelector('.canvas');
    let ctx = canvas.getContext('2d');

    let kg = 'кг';
    let [longY, startPoint, stepX] = [320, 50, 20];
    let [startX, startY, endX1, endY1] = [30, 320, 30, 20];
    let [endX2, endY2] = [1000, 320];

    document.addEventListener('DOMContentLoaded', () => {
        if (getFromLocalStorage(arrMonths[date.getMonth()])) {

            getGraph(extractJson(arrMonths[date.getMonth()]), startPoint, stepX ,longY);

            if (getDataFromLocalStorageJson('text')) {
                showText(elements, getDataFromLocalStorageJson('text'));
            }

        } else  {
            getAxisY(startX, startY, endX1, endY1);
            getAxesX(startX, startY, endX2, endY2);
        }
    });

    document.addEventListener('beforeunload', () => {
        saveInLocalStorage('today', data);
    });

    input.addEventListener('blur', () => {
        if (input.value != '') {
            addInLocalStorageData('data', data);
            addInLocalStorageData(arrMonths[date.getMonth()], input.value);
        }
    });

    form.addEventListener('submit', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        getGraph(extractJson(arrMonths[date.getMonth()]), startPoint, stepX ,longY);

        saveInLocalStorage('today', data);
        saveInLocalStorage('text', [data, input.value + ' ' + kg]);

        showText(elements, [data, input.value + ' ' + kg]);

        showElement(cancel, submit);
        
        input.value = '';
        event.preventDefault();
    });

    cancel.addEventListener('click', () => { 
        changeLocalStorage(arrMonths[date.getMonth()]);
        changeLocalStorage('data');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        getGraph(extractJson(arrMonths[date.getMonth()]), startPoint, stepX ,longY);

        showText(elements);

        removeInLocalStorage('today');
        removeInLocalStorage('text');

        hiddenElement(cancel, submit);
    });





    

    //Functions

    function getGraph(arr, startPoint, stepX, longY) {
        getAxisY(startX, startY, endX1, endY1);
        getAxesX(startX, startY, endX2, endY2);

        for (let i = 0 , x = startPoint; i < arr.length; i++, x += stepX) {
            let y = longY - arr[i];

            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, getRadians(360));
            ctx.fill();
        }

        getJoinLine(arr, startPoint, stepX, longY);
    }

    function getJoinLine(arr, startPoint, stepX, longY) {

        for (let i = 0 , x = startPoint; i < arr.length; i++, x += stepX) {

            if (arr[i + 1]) {
                let y1 = longY - arr[i];
                let y2 = longY - arr[i + 1];

                ctx.beginPath();
                ctx.moveTo(x, y1);
                ctx.lineTo(x + stepX, y2);
                ctx.stroke();

            }
        }
    }

    function extractJson(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    function getAxesX(startX, startY, endX2, endY2) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX2, endY2)
        ctx.stroke();
    }

    function getAxisY(startX, startY, endX1, endY1) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX1, endY1);
        ctx.stroke();
    }

    function getRadians(degrees) {
        return (Math.PI/180)*degrees;
    }

    function addInLocalStorageData(key, value) {

        if (localStorage.getItem(key)) {
            let arr = JSON.parse(localStorage.getItem(key));
            arr.push(value);

            let json = JSON.stringify(arr);
            localStorage.setItem(key, json);
        } else {
            let arr = [];
            arr.push(value);

            let json = JSON.stringify(arr);
            localStorage.setItem(key, json);
        }
    }

    function changeLocalStorage(key) {
        let arr = JSON.parse(localStorage.getItem(key));
        arr.pop();

        let json = JSON.stringify(arr);
        localStorage.setItem(key, json);
    }

    function saveInLocalStorage(key, value) {
        if (typeof(value) == 'string') {
            localStorage.setItem(key, value);
        } else {
            let json = JSON.stringify(value);
            localStorage.setItem(key, json);
        }
    }

    function removeInLocalStorage(key) {
        return localStorage.removeItem(key);
    }

    function getFromLocalStorage(key) {
        return localStorage.getItem(key);
    }

    function getDataFromLocalStorageJson(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    function showElement(elemCancel, elemSubmit) {
        elemCancel.classList.remove('hidden');
        elemCancel.classList.add('visible');
        elemSubmit.disabled = true;
    }

    function hiddenElement(elemCancel, elemSubmit) {
        elemCancel.classList.add('hidden');
        elemCancel.classList.remove('visible');
        elemSubmit.disabled = false;
    }

    function showText(elements, arrValue) {
        if (arrValue != undefined) {
            for (let i = 0; i < elements.length; i++) {
                elements[i].innerHTML = elements[i].innerHTML + ' ' + arrValue[i];
            }
        } else {
            for (let i = 0; i < elements.length; i++) {
                elements[i].innerHTML = '';
            }
        }
    }
    //localStorage.clear();
})();