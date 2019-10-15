const quoteList = document.getElementById('quote-list');
const newQuoteForm = document.getElementById('new-quote-form');

document.addEventListener('DOMContentLoaded', function(){

    newQuoteForm.addEventListener('submit', function(){
        event.preventDefault();
        let quote = document.getElementById('new-quote').value;
        let author = document.getElementById('author').value;
        fetch('http://localhost:3000/quotes?_embed=likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                quote: quote,
                author: author
            })
        })
        quoteList.innerHTML = '';
        fetchQuotes();
        newQuoteForm.reset();
    });

    document.addEventListener('click', function(){
        if(event.target.className === 'btn-danger'){
            let id = parseInt(event.target.parentNode.id);
            fetch(`http://localhost:3000/quotes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            quoteList.removeChild(event.target.parentNode.parentNode);
        }

        else if(event.target.className === 'btn-success'){
            let quoteId = parseInt(event.target.parentNode.id);
            fetch('http://localhost:3000/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    'quoteId': quoteId,
                    'createdAt': Date.now()
                })
            })
            // window.location.reload();
            let spanTag = event.target.parentNode.querySelector('span')
            spanTag.innerHTML = parseInt(spanTag.innerHTML) + 1
        }
    })

    fetchQuotes();
})

//-------------------------------------------------------------------
function fetchQuotes(){ 
    fetch('http://localhost:3000/quotes?_embed=likes', {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(data => {
        data.forEach(quote => {
            let newQuoteCard = renderQuotes(quote.quote, quote.author, parseInt(quote.id), quote.likes.length)
            quoteList.appendChild(newQuoteCard);
        })
    })
}

function renderQuotes(quote, author, id, likesCount){
    let quoteCard = document.createElement('li');
    let blockQuote = document.createElement('blockquote');
    quoteCard.setAttribute('class','quote-card');
    blockQuote.id = id;
    blockQuote.setAttribute('class', 'blockquote');
    blockQuote.innerHTML = `
        <p class='mb-0'>${quote}</p>
        <footer class='blockquote-footer'>${author}</footer>
            <br>
        <button class='btn-success'>Likes: <span>${likesCount}</span></button>
        <button class='btn-danger'>Delete</button>
    `
    quoteCard.appendChild(blockQuote);
    return quoteCard;
}