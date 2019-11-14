(function() {
    let content = document.querySelector('.content');
    let form = content.querySelector('.content-canvas-form');
    let input = form.querySelector('.content-canvas-form--inputWeight');
    let submit = form.querySelector('.content-canvas-form--inputSubmit');
    let cancel =  form.querySelector('.content-canvas-form--inputCancel');
    let elements = content.querySelectorAll('.date, .weight');

    let date = new Date();
    let data = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

    checkDay(data);

    const objMonths = {
                        0: 'January', 1: 'February', 2: 'Match', 3: 'April',
                        4: 'May', 5: 'June', 6: 'July', 7: 'August',
                        8: 'September', 9: 'October', 10: 'November', 11: 'December'
                    };

    window.months = objMonths;

    let canvas = document.querySelector('.canvas');
    let ctx = canvas.getContext('2d');

    let kg = 'кг';
    let [longY, startPoint, stepX] = [320, 50, 20];
    let [startX, startY, endX1, endY1] = [30, 320, 30, 20];
    let [endX2, endY2] = [1000, 320];
    let [xText, yText, stepDashLine] = [850, 50, 320];
    let [keyData, keyToday, keyText, keyMonthYear, keyHistory] = [
                                                        'data' + objMonths[date.getMonth()] + ', ' + date.getFullYear(), 'today',
                                                        'text', objMonths[date.getMonth()] + ', ' + date.getFullYear(),
                                                        'history'
                                                    ];

    document.addEventListener('DOMContentLoaded', () => {
        if (getFromLocalStorage(keyMonthYear)) {

            getGraph(extractJson(keyMonthYear), startPoint, stepX ,longY, getDataFromLocalStorageJson(keyData));
          
            getLineDash(stepDashLine, extractJson(keyMonthYear));

            showMonthAndYear(keyMonthYear, xText, yText);

        } else {
            getAxisY(startX, startY, endX1, endY1);
            getAxesX(startX, startY, endX2, endY2);
        }
    });



    document.addEventListener('beforeunload', () => {
        saveInLocalStorage(keyToday, data);
    });

    input.addEventListener('blur', () => {
        if (input.value != '') {

            addInLocalStorageData(keyData, data);

            addInLocalStorageData(keyMonthYear, input.value);

            saveHistoryInLocalStorage(keyHistory, keyMonthYear);

        }
    });



    form.addEventListener('submit', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        getGraph(extractJson(keyMonthYear), startPoint, stepX ,longY, getDataFromLocalStorageJson(keyData));

        getLineDash(stepDashLine, extractJson(keyMonthYear));

        showMonthAndYear(keyMonthYear,xText, yText);

        saveInLocalStorage(keyToday, data);

        showElement(cancel, submit);
        
        input.value = '';
        event.preventDefault();
    });



    cancel.addEventListener('click', () => { 
        changeLocalStorage(keyMonthYear);
        changeLocalStorage(keyData);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        getGraph(extractJson(keyMonthYear), startPoint, stepX , longY, getDataFromLocalStorageJson(keyData));

        getLineDash(stepDashLine, extractJson(keyMonthYear));

        showMonthAndYear(keyMonthYear, xText, yText);

        removeInLocalStorage(keyToday);
        removeInLocalStorage(keyText);

        hiddenElement(cancel, submit);
    });





    

    //Functions

    function getGraph(arrWeight, startPoint, stepX, longY, arrDate) {
        getAxisY(startX, startY, endX1, endY1);
        getAxesX(startX, startY, endX2, endY2);
        getJoinLine(arrWeight, startPoint, stepX, longY);

        for (let i = 0 , x = startPoint; i < arrWeight.length; i++, x += stepX) {
            let y = longY - arrWeight[i];

            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, getRadians(360));
            ctx.fill();

            ctx.font = '11px Arial';
            ctx.fillText(arrWeight[i], x - 7, y - 10);
            ctx.fillText(String(arrDate[i]).slice(0, 2), x - 5, y + (+arrWeight[i] + 13));
        }
    }

    function getJoinLine(arrWeight, startPoint, stepX, longY) {

        for (let i = 0 , x = startPoint; i < arrWeight.length; i++, x += stepX) {

            if (arrWeight[i + 1]) {
                let y1 = longY - arrWeight[i];
                let y2 = longY - arrWeight[i + 1];

                ctx.beginPath();
                ctx.moveTo(x, y1);
                ctx.lineTo(x + stepX, y2);
                ctx.stroke();
            }
        }
    }

    function getAxesX(startX, startY, endX2, endY2) {
        ctx.beginPath();
        ctx.setLineDash([0]);
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX2, endY2);
        ctx.stroke();

        ctx.font = '13px Arial';
        ctx.fillText('день', endX2 + 10, endY2 + 10);
    }

    function getAxisY(startX, startY, endX1, endY1) {
        ctx.beginPath();
        ctx.setLineDash([0]);
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX1, endY1);
        ctx.stroke();

        ctx.font = '13px Arial';
        ctx.fillText(kg, endX1 - 15, endY1);
    }

    function getLineDash(stepDashLine, arrWeight) {
        for (let i = 0 , x = startPoint; i < arrWeight.length; i++, x += stepX) {
            let y = longY - arrWeight[i];

            ctx.beginPath();
            ctx.setLineDash([5]);
            ctx.moveTo(x, stepDashLine);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
   
    function showMonthAndYear(keyMonthYear, xText, yText) {
        ctx.beginPath();
        ctx.font = '25px Arial';
        ctx.fillText(keyMonthYear, xText, yText);
    }

    function extractJson(key) {
        return JSON.parse(localStorage.getItem(key));
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
                elements[i].innerHTML = arrValue[i];
            }
        } else {
            for (let i = 0; i < elements.length; i++) {
                elements[i].innerHTML = '';
            }
        }
    }

    function checkDay(data) {
        if (getFromLocalStorage('today') == data) {
            showElement(cancel, submit);
        } else {
            hiddenElement(cancel, submit);
            showText(elements);
        }
    }

    function saveHistoryInLocalStorage(key, currentMonthYear) {
        if (localStorage.getItem(key)) {
            let arrHistory = JSON.parse(localStorage.getItem(key));

            for (let elem of arrHistory) {
                if (elem != currentMonthYear) {
                    arrHistory.push(currentMonthYear);
    
                    let json = JSON.stringify(arrHistory);
                    localStorage.setItem(key, json);
                }
            }
        } else {
            let arrHistory = [];
            arrHistory.push(currentMonthYear);

            let json = JSON.stringify(arrHistory);
            localStorage.setItem(key, json);
        }
    }
    //localStorage.clear();
})();