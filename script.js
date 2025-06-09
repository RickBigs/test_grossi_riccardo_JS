let prodotti = [
    {
        id: 1,
        nome: "Samsung Galaxy",
        categoria: "Elettronica",
        fornitore: "Euronics",
        prezzo: 299.99,
        quantita: 15,
        sogliaMinima: 10,
        dataArrivo: "2024-05-15"
    },
    {
        id: 2,
        nome: "Jeans Slim Fit",
        categoria: "Abbigliamento",
        fornitore: "Zara",
        prezzo: 45.00,
        quantita: 3,
        sogliaMinima: 5,
        dataArrivo: "2024-04-20"
    },
    {
        id: 3,
        nome: "Laptop HP",
        categoria: "Elettronica",
        fornitore: "MediaWorld",
        prezzo: 699.99,
        quantita: 0,
        sogliaMinima: 3,
        dataArrivo: "2024-03-10"
    },
    {
        id: 4,
        nome: "Tavolo da Cucina",
        categoria: "Casa",
        fornitore: "MondoConvenienza",
        prezzo: 189.50,
        quantita: 8,
        sogliaMinima: 2,
        dataArrivo: "2024-06-01"
    },
    {
        id: 5,
        nome: "Maglietta Cotone",
        categoria: "Abbigliamento",
        fornitore: "PiazzaItalia",
        prezzo: 19.99,
        quantita: 2,
        sogliaMinima: 10,
        dataArrivo: "2024-05-05"
    },
    {
        id: 6,
        nome: "Frigorifero LG",
        categoria: "Elettrodomestici",
        fornitore: "Unieuro",
        prezzo: 899.00,
        quantita: 4,
        sogliaMinima: 2,
        dataArrivo: "2024-05-28"
    },
    {
        id: 7,
        nome: "Sneaker Nike",
        categoria: "Sport",
        fornitore: "NikeStore",
        prezzo: 89.99,
        quantita: 12,
        sogliaMinima: 8,
        dataArrivo: "2024-06-05"
    },
    {
        id: 8,
        nome: "Libro \"Il Nome della Rosa\"",
        categoria: "Libri",
        fornitore: "LibrerieCoop",
        prezzo: 12.50,
        quantita: 1,
        sogliaMinima: 5,
        dataArrivo: "2024-04-15"
    }
];


let filtriCorrente = {
    ricerca: '',
    categoria: '',
    statoScorte: '',
    ordinamento: ''
};


inizializzaApp();


function inizializzaApp() {
    aggiornaTabella();
    filtroCategorie();
    inizializzaEventi();
}


function inizializzaEventi() {

    document.getElementById('formProdotti').addEventListener('submit', aggiungiProdotto);
    

    document.getElementById('cerca').addEventListener('input', function(e) {
        filtriCorrente.ricerca = e.target.value.toLowerCase();
        applicaFiltri();
    });
    

    document.getElementById('filtroCategorie').addEventListener('change', function(e) {
        filtriCorrente.categoria = e.target.value;
        applicaFiltri();
    });
    
    document.getElementById('filtroScorte').addEventListener('change', function(e) {
        filtriCorrente.statoScorte = e.target.value;
        applicaFiltri();
    });
    
    document.getElementById('ordinamento').addEventListener('change', function(e) {
        filtriCorrente.ordinamento = e.target.value;
        applicaFiltri();
    });
    

    document.getElementById('resetFiltri').addEventListener('click', resetFiltri);
}


function aggiungiProdotto(e) {
    e.preventDefault();
    const form = e.target;
    const nome = form.nome.value.trim();
    const categoria = form.categoria.value.trim();
    const fornitore = form.fornitore.value.trim();
    const prezzo = parseFloat(form.prezzo.value);
    const quantita = parseInt(form.quantita.value);
    const sogliaMinima = parseInt(form.sogliaMinima.value);
    if (!nome || !categoria || !fornitore) {
        alert('Tutti i campi obbligatori devono essere compilati!');
        return;
    }
    if (prezzo <= 0) {
        alert('Il prezzo deve essere un numero positivo!');
        return;
    }
    if (quantita < 0 || !Number.isInteger(quantita)) {
        alert('La quantità deve essere un numero intero positivo o zero!');
        return;
    }
    if (sogliaMinima <= 0 || !Number.isInteger(sogliaMinima)) {
        alert('La soglia minima deve essere un numero intero positivo!');
        return;
    }
    const nuovoId = Math.max(0, ...prodotti.map(p => p.id)) + 1;
    prodotti.push({
        id: nuovoId,
        nome,
        categoria,
        fornitore,
        prezzo,
        quantita,
        sogliaMinima,
        dataArrivo: new Date().toISOString().split('T')[0]
    });
    aggiornaTabella();
    filtroCategorie();
    form.reset();
    mostraMessaggioSuccesso();
}

function mostraMessaggioSuccesso() {
    const messaggio = document.getElementById('messaggioSuccesso');
    messaggio.classList.remove('hidden');
    messaggio.classList.add('show');
    setTimeout(() => {
        messaggio.classList.add('hidden');
        messaggio.classList.remove('show');
    }, 2000);
}


function aggiornaTabella(prodottiFiltrati = null) {
    const tbody = document.getElementById('tabellaProdotti');
    const prodottiDaMostrare = prodottiFiltrati || prodotti;
    if (prodottiDaMostrare.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="empty-state"><h3>Nessun prodotto trovato</h3><p>Prova a modificare i filtri di ricerca</p></td></tr>';
        document.getElementById('totaleInventario').textContent = '€0.00';
        return;
    }
    tbody.innerHTML = prodottiDaMostrare.map(prodotto => {
        const statoScorte = getStatoScorte(prodotto);
        const classeRiga = statoScorte === 'out' ? 'out-of-stock' : 
                          statoScorte === 'low' ? 'low-stock' : '';
        const valoreTotale = (prodotto.prezzo * prodotto.quantita).toFixed(2);
        return `
            <tr class="${classeRiga}">
                <td>${prodotto.id}</td>
                <td>${prodotto.nome}</td>
                <td>${prodotto.categoria}</td>
                <td>${prodotto.fornitore}</td>
                <td class="price">€${prodotto.prezzo.toFixed(2)}</td>
                <td class="quantity ${statoScorte === 'out' ? 'out' : statoScorte === 'low' ? 'low' : ''}">${prodotto.quantita}</td>
                <td>${prodotto.sogliaMinima}</td>
                <td>${formatData(prodotto.dataArrivo)}</td>
                <td class="total-value">€${valoreTotale}</td>
                <td>
                    <div class="action-buttons">
                        <div class="stock-controls">
                            <input type="number" class="stock-input" min="1" value="1" id="carico-${prodotto.id}">
                            <button class="btn btn-sm btn--success" onclick="caricoMerce(${prodotto.id})">+</button>
                            <button class="btn btn-sm btn--warning" onclick="scaricoMerce(${prodotto.id})">-</button>
                        </div>
                        <button class="btn btn-sm btn--danger" onclick="eliminaProdotto(${prodotto.id})">Elimina</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    const totaleInventario = prodottiDaMostrare.reduce((sum, p) => sum + (p.prezzo * p.quantita), 0);
    document.getElementById('totaleInventario').textContent = `€${totaleInventario.toFixed(2)}`;
}


function getStatoScorte(prodotto) {
    if (prodotto.quantita === 0) return 'out';
    if (prodotto.quantita <= prodotto.sogliaMinima) return 'low';
    return 'ok';
}


function formatData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('it-IT');
}


function caricoMerce(id) {
    const input = document.getElementById(`carico-${id}`);
    const quantitaDaAggiungere = parseInt(input.value);
    
    if (!quantitaDaAggiungere || quantitaDaAggiungere <= 0) {
        alert('Inserire una quantità valida da caricare!');
        return;
    }
    
    const prodotto = prodotti.find(p => p.id === id);
    if (prodotto) {
        prodotto.quantita += quantitaDaAggiungere;
        prodotto.dataArrivo = new Date().toISOString().split('T')[0];
        
        aggiornaTabella();
        input.value = '1';
    }
}


function scaricoMerce(id) {
    const input = document.getElementById(`carico-${id}`);
    const quantitaDaSottrarre = parseInt(input.value);
    
    if (!quantitaDaSottrarre || quantitaDaSottrarre <= 0) {
        alert('Inserire una quantità valida da scaricare!');
        return;
    }
    
    const prodotto = prodotti.find(p => p.id === id);
    if (prodotto) {
        if (prodotto.quantita < quantitaDaSottrarre) {
            alert('Quantità insufficiente in magazzino!');
            return;
        }
        
        prodotto.quantita -= quantitaDaSottrarre;
        
        aggiornaTabella();
        input.value = '1';
    }
}


function eliminaProdotto(id) {
    const prodotto = prodotti.find(p => p.id === id);
    if (!prodotto) return;
    
    if (confirm(`Sei sicuro di voler eliminare "${prodotto.nome}"?`)) {
        prodotti = prodotti.filter(p => p.id !== id);
        
        aggiornaTabella();
        filtroCategorie();
        messaggioEliminazione();
    }
}

function messaggioEliminazione() {
    const msg = document.getElementById('messaggioElimina');
    msg.textContent = 'Prodotto eliminato';
    msg.classList.remove('hidden');
    msg.classList.add('delete-message'); // Assicura stile rosso e grassetto
    setTimeout(() => {
        msg.classList.add('hidden');
        msg.classList.remove('delete-message');
    }, 2000);
}


function filtroCategorie() {
    const categorie = [...new Set(prodotti.map(p => p.categoria))].sort();
    const select = document.getElementById('filtroCategorie');
    

    const selezioneCorrente = select.value;
    
    select.innerHTML = '<option value="">Tutte le categorie</option>';
    categorie.forEach(categoria => {
        select.innerHTML += `<option value="${categoria}">${categoria}</option>`;
    });
    
    if (categorie.includes(selezioneCorrente)) {
        select.value = selezioneCorrente;
    }
}


function applicaFiltri() {
    let prodottiFiltrati = [...prodotti];
    

    if (filtriCorrente.ricerca) {
        prodottiFiltrati = prodottiFiltrati.filter(p => 
            p.nome.toLowerCase().includes(filtriCorrente.ricerca) ||
            p.fornitore.toLowerCase().includes(filtriCorrente.ricerca)
        );
    }
    

    if (filtriCorrente.categoria) {
        prodottiFiltrati = prodottiFiltrati.filter(p => p.categoria === filtriCorrente.categoria);
    }
    

    if (filtriCorrente.statoScorte) {
        prodottiFiltrati = prodottiFiltrati.filter(p => {
            const stato = getStatoScorte(p);
            return stato === filtriCorrente.statoScorte;
        });
    }
    

    if (filtriCorrente.ordinamento) {
        const [campo, direzione] = filtriCorrente.ordinamento.split('-');
        prodottiFiltrati.sort((a, b) => {
            let valorea, valoreb;
            if (campo === 'name') {
                valorea = a.nome.toLowerCase();
                valoreb = b.nome.toLowerCase();
            } else if (campo === 'category') {
                valorea = a.categoria.toLowerCase();
                valoreb = b.categoria.toLowerCase();
            }
            if (direzione === 'asc') {
                return valorea < valoreb ? -1 : valorea > valoreb ? 1 : 0;
            } else {
                return valorea > valoreb ? -1 : valorea < valoreb ? 1 : 0;
            }
        });
    }
    
    aggiornaTabella(prodottiFiltrati);
}


function resetFiltri() {
    filtriCorrente = {
        ricerca: '',
        categoria: '',
        statoScorte: '',
        ordinamento: ''
    };
    
    document.getElementById('cerca').value = '';
    document.getElementById('filtroCategorie').value = '';
    document.getElementById('filtroScorte').value = '';
    document.getElementById('ordinamento').value = '';
    
    aggiornaTabella();
}