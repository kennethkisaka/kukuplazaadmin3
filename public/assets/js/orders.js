document.addEventListener('DOMContentLoaded', function() {
    fetchTransactions(1); // Fetch the first page by default

    document.querySelectorAll('.paginator-button').forEach(button => {
        button.addEventListener('click', function() {
            const page = parseInt(this.dataset.page, 10);
            fetchTransactions(page);
        });
    });
});

async function fetchTransactions(page) {
    try {
        const response = await fetch(`/transactions?page=${page}`);
        const transactions = await response.json();

        const ordersTableBody = document.querySelector('#orders-all tbody');
        ordersTableBody.innerHTML = ''; // Clear existing rows

        transactions.forEach((transaction, index) => {
            const transactionDate = transaction.transactiondate || '';
            const formattedDate = transactionDate ? formatDate(transactionDate) : 'N/A';
            const formattedTime = transactionDate ? formatTime(transactionDate) : 'N/A';

            const row = document.createElement('tr');

            row.innerHTML = `
                <td class="cell">#${index + 1}</td>
                <td class="cell"><span class="truncate">${transaction.productid || 'N/A'}</span></td>
                <td class="cell">${transaction.customer || 'N/A'}</td>
                <td class="cell">${transaction.location || 'N/A'}</td>
                <td class="cell"><span>${formattedDate}</span><span class="note">${formattedTime}</span></td>
                <td class="cell"><span class="badge ${getStatusBadge(transaction.payment_status)}">${transaction.payment_status}</span></td>
                <td class="cell">${transaction.amount || 'N/A'}</td>
                <td class="cell">${transaction.phone_number || 'N/A'}</td>
                <td class="cell">${transaction.delivery_status || 'N/A'}</td>
            `;

            ordersTableBody.appendChild(row);
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
