(function () {
   let navigation = document.querySelector('.navigation');
   let buttonMenu = navigation.querySelector('.navigation-buttonMenu');
   let dropMenu = document.querySelector('.drop-menu');
   let menuList = dropMenu.querySelector('.drop-menu-list');
   let defaultText = dropMenu.querySelector('.drop-menu--defaultText');
   let clearHistory = dropMenu.querySelector('.drop-menu--clearHistory');
   let form = document.querySelector('.content-canvas-form');

   let canvas = document.querySelector('.canvas');
   let ctx = canvas.getContext('2d');

   let objMonths = months;

   let kg = 'кг';
   let [longY, startPoint, stepX] = [320, 50, 20];
   let [startX, startY, endX1, endY1] = [30, 320, 30, 20];
   let [endX2, endY2] = [1000, 320];
   let [xText, yText, stepDashLine] = [850, 50, 320];
  

   let date = new Date();
   let current =  objMonths[date.getMonth()] + ', ' + date.getFullYear();

   let arr = getDataFromLocalStorageJson('history');
   let links = createList(arr);

   if (links != undefined) {

      for(let link of links) {

         link.addEventListener('click', function() {

            console.log(this.innerHTML);

            getGraph(extractJson(this.innerHTML), startPoint, stepX ,longY, getDataFromLocalStorageJson('data' + this.innerHTML));

            getLineDash(stepDashLine, extractJson(this.innerHTML));

            showMonthAndYear(this.innerHTML, xText, yText);

            form.classList.add('hidden');
            
         });
      }
   }

   buttonMenu.addEventListener('mousedown', function showDropMenu() {
      buttonMenu.classList.add('shadow');

      let obj = buttonMenu.getBoundingClientRect();

      dropMenu.style.top = obj.bottom + 10 + 'px';
      dropMenu.style.left = obj.left - 100 + 'px';

      setTimeout(() => {
         if (dropMenu.classList.contains('hidden')) {
            dropMenu.classList.remove('hidden');
         } else {
            dropMenu.classList.add('hidden');
         }
        
      }, 200);




      dropMenu.addEventListener('click', function hiddenMenuAfterClick() {
         setTimeout(() => {

            dropMenu.classList.add('hidden');
            dropMenu.removeEventListener('click', hiddenMenuAfterClick);

         }, 200);
      });
   });



   buttonMenu.addEventListener('mouseup', () => {
      buttonMenu.classList.remove('shadow');
   });

   clearHistory.addEventListener('click', () => {
      let arr = getDataFromLocalStorageJson('history');
      arr.length = 0;

      let json = JSON.stringify(arr);
      localStorage.setItem('history', json);
   });

   function getDataFromLocalStorageJson(key) {
      return JSON.parse(localStorage.getItem(key));
  }

   function createList(arr) {
      let elements = [];

      for (let i = 0; i < arr.length; i++) {

         if (arr[i] != current) {

            let li = document.createElement('li');

            let a = document.createElement('a');
            a.innerHTML = arr[i];
            a.href = '#';

            li.appendChild(a);
            menuList.appendChild(li);

            defaultText.classList.add('hidden');

            elements.push(a);

            return elements;

         } else {
            defaultText.classList.remove('hidden');
         }
      }

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

   function getFromLocalStorage(key) {
      return localStorage.getItem(key);
  }

   function getDataFromLocalStorageJson(key) {
      return JSON.parse(localStorage.getItem(key));
  }
})();