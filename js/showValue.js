(function () {
    let navigation = document.querySelector('.navigation');
    let buttonMenu = navigation.querySelector('.navigation-buttonMenu');

    buttonMenu.addEventListener('mousedown', () => {
       buttonMenu.classList.add('shadow');

    //    let style = getComputedStyle(buttonMenu);
    //    console.log(style.width);
    //    console.log(style.height);

    //    let obj = buttonMenu.getBoundingClientRect();
    //    console.log(obj.x, obj.y);
   });

    buttonMenu.addEventListener('mouseup', () => {
       buttonMenu.classList.remove('shadow');
    });
})();