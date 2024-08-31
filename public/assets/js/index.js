document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    const form = document.querySelector('#henForm');
    console.log(form)

    // Add submit event listener
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        // Get form data
        const formData = new FormData(form);
        console.log(`formdata ${formData.get('chickenType')}`)
        const data = {
            action: formData.get('action'),
            type: formData.get('chickenType'),
            quantity: parseInt(formData.get('quantity'), 10),
        };

        try {
            // Send data to the backend
            const response = await fetch('/update-stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            // Handle the response from the backend
            if (response.ok) {
                const result = await response.json();
                alert(result.message); // Show success message or update the UI as needed
            } else {
                const error = await response.json();
                alert('Error: ' + error.message); // Show error message
            }
        } catch (error) {
            console.error('Error submitting the form:', error);
            alert('An error occurred while submitting the form.');
        }
    });
});
