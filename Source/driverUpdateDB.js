const currentDeliveryTrack = document.body.querySelector('#packageNumber');

async function fetchPatchDeliveryStatus(deliveryId, quiet = false) {
    try{
        const response = await fetch(`/Livraisons/${deliveryId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Status: 'Livré' })
        });

        if(!quiet) {
            if(response.ok) {
                const data = response.json();
                console.log("Patch successful:", data);
                alert("Delivery updated successfully");
            }else {
                const errorData = await response.json();
                console.error("Patch failed:", errorData);
                alert("Failed to update delivery status: " + (errorData.error || "Unknown error"));
            }
        }
    } catch (err) {
            console.error("Error:", err);
            alert("Error. Unable to update delivery status.");
    }
}

addEventListener('click', async function(event) {
    if(event.target.id === 'issueButton') {
        alert("issueButton clicked");
    }
    else if(event.target.id === 'markAsDeliveredButton') {
        alert("markAsDeliveredButton clicked");
        await fetchPatchDeliveryStatus(currentDeliveryTrack.innerText);
        window.location.reload();
    }
});