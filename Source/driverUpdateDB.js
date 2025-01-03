const currentDeliveryTrack = document.body.querySelector('#packageNumber');

async function fetchPatchDeliveryStatus(deliveryId, status) {
    try{
        const response = await fetch(`/Livraisons/${deliveryId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('authtoken'),
                'email': localStorage.getItem('email')
            },
            body: JSON.stringify({ Status: status })
        });

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Unknown error');
        }

        if(response.ok) {
            const data = response.json();
            console.log("Patch successful:", data);
            alert("Delivery updated successfully");
        }else {
            const errorData = await response.json();
            console.error("Patch failed:", errorData);
            alert("Failed to update delivery status: " + (errorData.error || "Unknown error"));
        }
    } catch (err) {
            console.error("Error:", err);
            alert("Error. Unable to update delivery status.");
    }
}

addEventListener('click', async function(event) {
    if(event.target.id === 'issueButton') {
        alert("issueButton clicked");
        await fetchPatchDeliveryStatus(currentDeliveryTrack.innerText, 'Problème');
        window.location.reload();
    }
    else if(event.target.id === 'markAsDeliveredButton') {
        await fetchPatchDeliveryStatus(currentDeliveryTrack.innerText, 'Livré');
        window.location.reload();
    }
});