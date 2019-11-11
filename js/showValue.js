(function () {
    let canvas = document.querySelector('.canvas');
    let ctx = canvas.getContext('2d');
    
    let date = new Date();

    const arrMonth = months;

    canvas.addEventListener('click', function(e) {

        // if (localStorage.getItem(arrMonth[date.getMonth()])) {
        //     console.log(localStorage.getItem(arrMonth[date.getMonth()]));
        //     console.log(localStorage.getItem('data'));
        //     console.log((e.clientX + 37) + ':' + e.clientY);
        // }
    });
})();