(function() {
    let content = document.querySelector('.content');
    let form = content.querySelector('.content-canvas-form');
    let input = form.querySelector('.content-canvas-form--inputWeight');
    let inputButton = form.querySelector('.content-canvas-form--inputButton');

    const objMonths = {
                        0: 'January', 1: 'February', 2: 'Match', 3: 'April',
                        4: 'May', 5: 'June', 6: 'July', 7: 'August',
                        8: 'September', 9: 'October', 10: 'November', 11: 'December'
                    };

    window.months = objMonths;

    let date = new Date();
    let data = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

    let canvas = document.querySelector('.canvas');
    let ctx = canvas.getContext('2d');

    let kg = 'кг';
    let [longY, startPoint, stepX] = [320, 50, 25];
    let [startX, startY, endX1, endY1] = [30, 320, 30, 20];
    let [endX2, endY2] = [1000, 320];
    let [xText, yText, stepDashLine] = [850, 50, 320];
    let [keyData, keyToday, keyText, keyMonthYear, keyHistory] = [
                                                        'data' + objMonths[date.getMonth()] + ', ' + date.getFullYear(), 'today',
                                                        'text', objMonths[date.getMonth()] + ', ' + date.getFullYear(),
                                                        'history'
                                                    ];

    document.addEventListener('DOMContentLoaded', () => {

        checkDay(data, inputButton);
        saveHistoryInLocalStorage(keyHistory, keyMonthYear);

        if (getFromLocalStorage(keyMonthYear)) {

            getGraph(extractJson(keyMonthYear), startPoint, stepX ,longY, getDataFromLocalStorageJson(keyData));

            getLineDash(stepDashLine, extractJson(keyMonthYear));

            showMonthAndYear(keyMonthYear, xText, yText);

        } else {

            getAxisY(startX, startY, endX1, endY1);

            getAxesX(startX, startY, endX2, endY2);

        }
    });

    input.addEventListener('blur', () => {
        if (input.value != '') {

            addInLocalStorageData(keyData, data);

            addInLocalStorageData(keyMonthYear, input.value);

        }
    });

    inputButton.addEventListener('click', enterValue);








    

    //Functions

    function enterValue() {
        if (input.value != '') {

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            getGraph(extractJson(keyMonthYear), startPoint, stepX ,longY, getDataFromLocalStorageJson(keyData));

            getLineDash(stepDashLine, extractJson(keyMonthYear));

            showMonthAndYear(keyMonthYear,xText, yText);

            localStorage.setItem(keyToday, data);

            inputButton.addEventListener('click', cancelEnter);

            
            input.value = '';
            inputButton.value = 'Отменить';
            inputButton.removeEventListener('click', enterValue);

        }
    }

    function cancelEnter() {

        changeLocalStorage(keyMonthYear);
        changeLocalStorage(keyData);

        getGraph(extractJson(keyMonthYear), startPoint, stepX , longY, getDataFromLocalStorageJson(keyData));

        getLineDash(stepDashLine, extractJson(keyMonthYear));

        showMonthAndYear(keyMonthYear, xText, yText);

        removeInLocalStorage(keyToday);
        removeInLocalStorage(keyText);

        inputButton.addEventListener('click', enterValue);
        inputButton.removeEventListener('click', cancelEnter);

        inputButton.value = 'Сохранить';
    }

    function getGraph(arrWeight, startPoint, stepX, longY, arrDate) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
            ctx.fillText(getDate(arrDate[i]), x - 5, y + (+arrWeight[i] + 13));
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

    function removeInLocalStorage(key) {
        return localStorage.removeItem(key);
    }

    function getFromLocalStorage(key) {
        return localStorage.getItem(key);
    }

    function getDataFromLocalStorageJson(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    function checkDay(data, elem) {
        if (getFromLocalStorage('today') == null) {
            elem.value = 'Сохранить';
            return;
        };
        
        if (getFromLocalStorage('today') == data && getDataFromLocalStorageJson(keyMonthYear) != null) {

            elem.value = 'Отменить';

            elem.removeEventListener('click', enterValue);
            elem.addEventListener('click', cancelEnter);

        } else {

            elem.value = 'Сохранить';

            elem.addEventListener('click', enterValue);
            elem.removeEventListener('click', cancelEnter);

            localStorage.setItem(keyToday, data);

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

    function getDate(date) {
	    let arr = date.split('.');

	    if (arr[0].length == 1) {
	      return String(arr[0]).slice(0, 1);
	    } else {
	      return String(arr[0]).slice(0, 2);
	    }
	  }
    //localStorage.clear();
})();