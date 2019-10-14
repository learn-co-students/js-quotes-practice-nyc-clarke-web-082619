// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener("DOMContentLoaded", () => {
    function createQuoteCard(quote){
        let quoteList = document.getElementById('quote-list');
        let quoteCard = document.createElement('li');
        quoteCard.classList.add('quote-card');
        let blockquote = document.createElement('blockquote');
        blockquote.classList.add('blockquote');
        let quoteP = document.createElement('p');
        //quoteP.setAttribute('id', quote.id);
        quoteP.classList.add('mb-0');
        let pText = document.createTextNode(quote.quote);
        quoteP.appendChild(pText);
        let footer = document.createElement('footer');
        footer.classList.add('blockquote-footer');
        let footerText = document.createTextNode(quote.author);
        footer.appendChild(footerText);
        let br = document.createElement('br');
        footer.appendChild(br);
        let likeButton = document.createElement('button');
        likeButton.setAttribute("id", quote.id);
        likeButton.classList.add('btn-success');
        let likeButtonText = document.createTextNode('Likes: ');
        likeButton.appendChild(likeButtonText);
        let likeSpan = document.createElement('span');
        let spanText = document.createTextNode(quote.likes.length);
        likeSpan.appendChild(spanText);
        likeButton.appendChild(likeSpan);
        let deleteButton = document.createElement('button');
        let deleteButtonText = document.createTextNode('delete')
        deleteButton.setAttribute("id", quote.id);
        deleteButton.appendChild(deleteButtonText);
        deleteButton.classList.add('btn-danger');
        quoteCard.appendChild(blockquote);
        blockquote.appendChild(quoteP);
        blockquote.appendChild(footer);
        blockquote.appendChild(likeButton);
        blockquote.appendChild(deleteButton);
        quoteList.appendChild(quoteCard);
    }

    function createQuoteList(){
        fetch('http://localhost:3000/quotes?_embed=likes')
        .then(response => response.json())
        .then(json => {
            json.forEach(quote => {
                createQuoteCard(quote);
            })
        })
    }

    function destroyQuoteList(){
        let quoteList = document.getElementById('quote-list');
        while(quoteList.firstChild){
            quoteList.removeChild(quoteList.firstChild);
        }
    }

    createQuoteList();

    function postLike(id){
        let formData = {
            "quoteId": parseInt(id, 10),
            "createdAt": Date.now()/1000
        }
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(formData)
        }
        fetch('http://localhost:3000/likes', configObj)
        .then(() => {
            destroyQuoteList();
            createQuoteList();
        })
    }

    function deleteQuote(id){
        configObj = {
            method: "DELETE"
        }
        fetch(`http://localhost:3000/quotes/${id}`, configObj)
        .then(()=> {
            destroyQuoteList();
            createQuoteList();
        })
    }

    function getFormData(){
        let quote = document.getElementById("new-quote").value;
        let author = document.getElementById('author').value;
        return {quote: quote, author: author}
    }

    function addQuote(){
        let formData = getFormData();
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                Accept: "application/json"
            },
            body: JSON.stringify(formData)
        }
        fetch('http://localhost:3000/quotes', configObj)
        .then(() => {
            destroyQuoteList();
            createQuoteList();
        })
    }

    document.getElementById('quote-list').addEventListener('click', (event) => {
        target = event.target;
        if(target.classList.contains("btn-success")){
            postLike(target.id);
        }

        else if(target.classList.contains("btn-danger")){
            deleteQuote(target.id);
        }
    })

    document.getElementById('new-quote-form').addEventListener('submit', (event) => {
        event.preventDefault();
        addQuote();
    })
})