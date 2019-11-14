(function () {
   let navigation = document.querySelector('.navigation');
   let buttonMenu = navigation.querySelector('.navigation-buttonMenu');
   let dropMenu = document.querySelector('.drop-menu');
   let menuList = dropMenu.querySelector('.drop-menu-list');
   let defaultText = dropMenu.querySelector('.drop-menu--defaultText');
   let clearHistory = dropMenu.querySelector('.drop-menu--clearHistory');

   let objMonths = months;

   let date = new Date();
   let current =  objMonths[date.getMonth()] + ', ' + date.getFullYear();

   buttonMenu.addEventListener('mousedown', function showDropMenu() {
      buttonMenu.classList.add('shadow');

      let obj = buttonMenu.getBoundingClientRect();

      dropMenu.style.top = obj.bottom + 10 + 'px';
      dropMenu.style.left = obj.left - 100 + 'px';

      menuList.innerHTML = '';

      if (localStorage.getItem('history')) {
         let arr = getDataFromLocalStorageJson('history');

         for (let i = 0; i < arr.length; i++) {

            if (arr[i] != current) {

               let li = document.createElement('li');

               let a = document.createElement('a');
               a.innerHTML = arr[i];
               a.href = '#';

               li.appendChild(a);
               menuList.appendChild(li);

               defaultText.classList.add('hidden');

            } else {
               defaultText.classList.remove('hidden');
            }
         }
      }

     

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
})();