'use strict';

/* Chart.js docs: https://www.chartjs.org/ */

window.chartColors = {
	green: '#75c181',
	gray: '#a9b5c9',
	text: '#252930',
	border: '#e7e9ed'
};




// Array of month names
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Get the current date
const currentDate = new Date();

// Get the current month and previous month
const currentMonthIndex = currentDate.getMonth();
const previousMonthIndex = (currentMonthIndex - 1 + 12) % 12;

// Get the names of the current and previous months
const currentMonthName = monthNames[currentMonthIndex];
const previousMonthName = monthNames[previousMonthIndex];

document.addEventListener('DOMContentLoaded', function() {
    fetch('/statistics')
    .then(response => response.json())
    .then(statistics => {
        console.log(statistics);


		if (statistics) {
            // Populate the Total Sales
            document.getElementById('total-sales').textContent = `KES ${statistics.total_sales}`;

            // Populate Hen Sold
            document.getElementById('hen-sold').textContent = statistics.hen_sold;

            // Populate Broilers
            document.getElementById('broilers').textContent = statistics.broilers;

            // Populate Kienyeji
            document.getElementById('kienyeji').textContent = statistics.kienyeji;
        } else {
            console.error('No data available for the current month');
        }


    })
    .catch(error => console.error('Error fetching statistics:', error));
});
