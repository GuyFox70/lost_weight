(function () {
   let navigation = document.querySelector('.navigation');
   let buttonMenu = navigation.querySelector('.navigation-buttonMenu');
   let dropMenu = document.querySelector('.drop-menu');
   let menuList = dropMenu.querySelector('.drop-menu-list');

   let date = new Date();

   let objMonths = months;

   buttonMenu.addEventListener('mousedown', function showDropMenu() {
      buttonMenu.classList.add('shadow');

      let obj = buttonMenu.getBoundingClientRect();

      dropMenu.style.top = obj.bottom + 10 + 'px';
      dropMenu.style.left = obj.left - 100 + 'px';

      menuList.innerHTML = '';

      for(let key in objMonths) {
         if (localStorage.getItem(objMonths[key] + ', ' + date.getFullYear())) {
            let li = document.createElement('li');

            let a = document.createElement('a');
            a.innerHTML = objMonths[key] + ', ' + date.getFullYear();
            a.href = '#';

            li.appendChild(a);
            menuList.appendChild(li);
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
})();