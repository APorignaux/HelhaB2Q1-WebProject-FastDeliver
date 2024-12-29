function redirectToEditDelivery(trackingNumber){
    console.log(trackingNumber);
    window.location.href = "http://localhost:3010/edit-delivery.html?deliveryID=" + trackingNumber;
}