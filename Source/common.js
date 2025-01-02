const h1GoBackHome = document.querySelector('#goBackHome');

h1GoBackHome.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '/index.html';
});