document.addEventListener('DOMContentLoaded', function() {
    fetchTransactions();

    async function fetchTransactions() {
        try {
            const response = await fetch('/transactions?page=1'); // Fetch the first page or all transactions if needed
            const transactions = await response.json();

            const deliveredOrdersTableBody = document.querySelector('#orders-delivered');
            const notDeliveredOrdersTableBody = document.querySelector('#orders-not-delivered');

            // Clear existing rows
            deliveredOrdersTableBody.innerHTML = '';
            notDeliveredOrdersTableBody.innerHTML = '';

            transactions.forEach((transaction, index) => {
                const transactionDate = transaction.transactiondate || '';
                const formattedDate = transactionDate ? formatDate(transactionDate) : 'N/A';
                const formattedTime = transactionDate ? formatTime(transactionDate) : 'N/A';

                const row = document.createElement('tr');
                const rowContent = `
                    <td class="cell">#${index + 1}</td>
                    <td class="cell"><span class="truncate">${transaction.productid || 'N/A'}</span></td>
                    <td class="cell">${transaction.customer || 'N/A'}</td>
                    <td class="cell">${transaction.location || 'N/A'}</td>
                    <td class="cell"><span>${formattedDate}</span><span class="note">${formattedTime}</span></td>
                    <td class="cell"><span class="badge ${getStatusBadge(transaction.payment_status)}">${transaction.payment_status}</span></td>
                    <td class="cell">KES ${transaction.amount || 'N/A'}</td>
                    <td class="cell">${transaction.phone_number || 'N/A'}</td>
                    <td class="cell">${transaction.delivery_status === "true" ? 'Delivered' : 'Not Delivered'}</td>
                `;

                row.innerHTML = rowContent;

                // Check delivery status and append to the correct table body
                if (transaction.delivery_status === "true") {
                    deliveredOrdersTableBody.appendChild(row);
                } else {
                    notDeliveredOrdersTableBody.appendChild(row);
                }
            });
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    }

    function getStatusBadge(status) {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-success';
            case 'pending':
                return 'bg-warning';
            case 'cancelled':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    }

    function formatDate(transactionDate) {
        // Assuming the transactionDate is in YYYYMMDDHHMMSS format
        return `${transactionDate.slice(0, 4)}-${transactionDate.slice(4, 6)}-${transactionDate.slice(6, 8)}`;
    }

    function formatTime(transactionDate) {
        // Assuming the transactionDate is in YYYYMMDDHHMMSS format
        return `${transactionDate.slice(8, 10)}:${transactionDate.slice(10, 12)}:${transactionDate.slice(12, 14)}`;
    }
});

