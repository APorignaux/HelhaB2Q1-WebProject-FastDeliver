const packetSearchBar = document.querySelector('#packetSearchBar');
const packetSearchButton = document.querySelector('#packetSearchButton');

packetSearchButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '/tracking.html?DeliveryID=' + packetSearchBar.value;
});