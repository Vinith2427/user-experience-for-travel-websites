// Toggle the visibility of place details
function toggleDetails(button) {
    const placeDetails = button.previousElementSibling;
    if (placeDetails.style.display === "none" || placeDetails.style.display === "") {
        placeDetails.style.display = "block";
        button.textContent = "Show Less";
    } else {
        placeDetails.style.display = "none";
        button.textContent = "Show More";
    }
}

// Filter places based on region
function filterPlaces(region) {
    const placeCards = document.querySelectorAll('.place-card');
    placeCards.forEach(card => {
        if (region === 'all' || card.getAttribute('data-region') === region) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// Smooth scroll to the places section when clicking "Explore Now" button
function explore() {
    window.scrollTo({
        top: document.querySelector('.places').offsetTop,
        behavior: 'smooth'
    });
}

document.getElementById('newsletter-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting normally
    const statusElement = document.getElementById('submission-status');
    statusElement.style.visibility = 'visible';  // Show the 'Submitting...' text

    // Simulate an API call or a form submission
    setTimeout(() => {
        statusElement.textContent = "Submitted!";
        statusElement.style.color = 'green';  // Change the color to indicate success
    }, 2000);  // Simulate a 2-second delay for the form submission
});
