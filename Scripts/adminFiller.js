const deliveryTemplate = document.querySelector('#delivery-row-template');
const Table = document.querySelector('#tableBody');

async function fetchDeliveries() {
    Table.innerHTML = '';

    const response = await fetch('/deliveries');
    const data = await response.json(); //le methode json est asynchrone et retourne un promesse
    const deliveries = data.results;

    for (let i = 0; i < deliveries.length; i++) {
        const delivery = deliveries[i];
        const deliveryRow = deliveryTemplate.content.cloneNode(true);

        const deliveryId = deliveryRow.querySelector('.delivery-id');
    }
}
