document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('information');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px'; 
    });
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

const $favourite = document.querySelector('#favourite');

if ($favourite) {
    $favourite.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id;
            const csrf = event.target.dataset.csrf;

            fetch('/favourite/remove/' + id, {
                method: 'DELETE',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(favourite => {
                const html = favourite.vacancies.map(c => {
                    return `
                    <div class="row">
                        <div class="col s12 m6">
                            <div class="card white darken-1">
                                <div class="card-content black-text">
                                    <span class="card-title">${c.title}</span>
                                    <p class="salary">${c.salary}</p>
                                </div>
                                <div class="card-action">
                                    <a href="/vacancies/${c._id}">Посмотреть</a>
                                </div>
                                <button 
                                    class="btn btm-small js-remove" 
                                    data-id="${c._id}" 
                                    data-csrf="${csrf}">
                                    Удалить
                                </button>
                            </div>
                        </div>
                    </div>
                    `;
                }).join('');
                $favourite.innerHTML = html;
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdowns, {});
});


M.Tabs.init(document.querySelectorAll('.tabs'));