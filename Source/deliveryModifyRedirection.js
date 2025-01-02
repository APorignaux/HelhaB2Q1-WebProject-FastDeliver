function redirectToEditDelivery(trackingNumber = null){
    if(trackingNumber == null){
        event.preventDefault();
        const existingTrackNumElements = document.querySelectorAll('.tracking-number');
        const existingTrackNum = Array.from(existingTrackNumElements).map(element => element.innerHTML);
        console.log(existingTrackNum);
        const newTrackNum = generateNewTrackNum(existingTrackNum);
        console.log("new tracking number :" + newTrackNum);
        window.location.href = "http://localhost:3010/edit-delivery.html?newDeliveryID=" + newTrackNum;
    }else{
        window.location.href = "http://localhost:3010/edit-delivery.html?deliveryID=" + trackingNumber;
    }
}

function generateNewTrackNum(existingNumbers){
    let newNumber;
    do {
        newNumber = Math.floor(10000000 + Math.random() * 90000000); // Generate an 8-digit number
    } while (existingNumbers.includes(newNumber));
    return newNumber = "FD" + newNumber.toString() + "BE";
}