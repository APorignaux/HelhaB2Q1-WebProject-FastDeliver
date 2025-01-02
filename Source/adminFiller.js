const deliveryTemplate = document.querySelector('#delivery-row-template');
const Table = document.querySelector('#tableBody');

async function fetchDeliveries() {
    Table.innerHTML = '';

    const response = await fetch('/Livraisons',{
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authtoken'),
            'email' : "admin@fastdeliver.com"
        }
    });
    const data = await response.json(); //le methode json est asynchrone et retourne un promesse
    const deliveries = data.results;

    for (let i = 0; i < deliveries.length; i++) {
        const delivery = deliveries[i];
        const deliveryRow = deliveryTemplate.content.cloneNode(true);//crée un clone du template pour chaque livraison

        const deliveryTrackId = deliveryRow.querySelector('.tracking-number');
        deliveryTrackId.innerHTML = delivery.NumSuivis;

        const deliveryDate = deliveryRow.querySelector('.date');
        deliveryDate.innerHTML = delivery.Date;

        const deliveryClient = deliveryRow.querySelector('.client');
        deliveryClient.innerHTML = delivery.ClientEmail;

        const deliveryAddress = deliveryRow.querySelector('.address');
        deliveryAddress.innerHTML = delivery.Addresse;

        const deliveryPoids = deliveryRow.querySelector('.poids');
        deliveryPoids.innerHTML = delivery.Poids;

        const deliveryStatus = deliveryRow.querySelector('.status');
        deliveryStatus.innerHTML = delivery.Status;

        const deliveryPerson = deliveryRow.querySelector('.delivery-person');
        deliveryPerson.innerHTML = delivery.Livreur;

        Table.appendChild(deliveryRow);
    }
}

window.onload = fetchDeliveries;