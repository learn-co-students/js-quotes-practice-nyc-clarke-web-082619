document.addEventListener('DOMContentLoaded', function(){
    var id;
    let host = document.getElementById('quote-list');

    function renderQuotes(quote){
        host.innerHTML += `
        <li class='quote-card'>
            <blockquote class="blockquote" id='${quote.id}'>
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer><br>
            <button class='btn-success'>Likes: <span class='span'>${quote.likes.length}</span></button>                    <button class='btn-danger'>Delete</button>
            </blockquote>
        </li>
        ` 
    }
    function getQuotes(){
        while(host.firstChild){
            host.removeChild(host.firstChild)
        }
        fetch('http://localhost:3000/quotes?_embed=likes')
        .then(resp =>{
            return resp.json();
        })
        .then(info =>{
            for(const quote of info){
                renderQuotes(quote)
            }
        })
    }

    function likeQuote(id){
        fetch(`http://localhost:3000/likes`,{
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
           quoteId: parseInt(id), 
           createdAt: Date.now()
        })
        })
       .then(resp =>{
            return resp.json();
        })   
    }

    function postQuote(){
        let newQuote = {};
        newQuote.quote = document.getElementById('new-quote').value;
        newQuote.author = document.getElementById('author').value;
        fetch('http://localhost:3000/quotes',{
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                quote: newQuote.quote, 
                author: newQuote.author
            })
        })
        .then(resp =>{
            return resp.json();
        })
    }

    host.addEventListener('click', function(){
        if(event.target.className === 'btn-success'){
        id = event.target.parentNode.id;
        let num = parseInt(event.target.querySelector('span').innerText);
        num+=1;
        event.target.querySelector('span').innerText = num;
        likeQuote(id);
        }
    })

    host.addEventListener('click', function(){
        if(event.target.className === "btn-danger"){
            id = event.target.parentNode.id;
            fetch(`http://localhost:3000/quotes/${id}`,{
                method: 'DELETE',
                headers:{
                    'content-type': 'application/json',
                    Accept: 'application/json'
                }
            })
        }
    })

    document.getElementById('new-quote-form').addEventListener('submit', function(event){
        event.preventDefault();
        postQuote();
        getQuotes();
    })
    getQuotes();
})


    
 