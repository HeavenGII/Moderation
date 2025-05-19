document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('information');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px'; 
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Materialize tabs
    const tabs = document.querySelectorAll('.tabs');
    M.Tabs.init(tabs);
});

const toCurrency = salary =>{
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(salary);
}

const toDate = date =>{
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
}

document.querySelectorAll('.salary').forEach(node => {
    node.textContent = toCurrency(node.textContent)
});

document.querySelectorAll('.date').forEach(node =>{
    node.textContent = toDate(node.textContent)
})

document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdowns, {});
});


M.Tabs.init(document.querySelectorAll('.tabs'));