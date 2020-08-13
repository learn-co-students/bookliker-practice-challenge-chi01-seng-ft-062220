// document.addEventListener('DOMContentLoaded', function() {
//     // const bookID = event.target.id
//     // if (event.target.tagName === 'LI'){
//     //     gatherBookInformation(bookID)
//     // } else if (event.target.tagName === 'BUTTON'){
//     //     console.log(event.target.parentNode.previousSibling.previousSibling)
//     //     // iLikedIt(bookID)
//     // }

// });
// 

fetch('http://localhost:3000/books')
    .then(resp => resp.json())
        .then(jsonData => {
            jsonData.forEach(book => bookList(book))
        })


function bookList(book){
    const listPane = document.querySelector('#list')
    const bookTitle = document.createElement('li')
    bookTitle.id = book.id
    bookTitle.innerText = book.title
    listPane.appendChild(bookTitle)
    bookTitle.addEventListener('click', function(event){
        bookInformation(book)
    })

}

function bookInformation(book){
    const showPane = document.querySelector('#show-panel')
        showPane.innerHTML = `<img src = ${book.img_url}>
        <p><strong>${book.title}</strong></p>`
        if(book.subtitle){
            showPane.innerHTML += `<p><strong>${book.subtitle}</strong></p>`
        }
        showPane.innerHTML += `<p><strong>${book.author}</strong></p><p>${book.description}</p><ul id='liked-users'></ul>`
        book.users.forEach(user => document.querySelector('#liked-users').innerHTML += `<li>${user.username}</li>`)
        const userArray = book.users

        if(userArray.find(function(user){return user.id === 1})){
            showPane.innerHTML += `<br><button id=${book.id}>UNLIKE</button>`
        }else{
            showPane.innerHTML += `<br><button id=${book.id}>LIKE</button>`
        }

        document.querySelector('BUTTON').addEventListener('click', function(event){
            if (event.target.innerHTML === 'LIKE'){
                iLikedIt(book)
            } else if (event.target.innerHTML === 'UNLIKE'){
                goodByeBook(book)
            }
        })
}


function iLikedIt(book){
    const reqObj = {
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json'
        }, 
        body: JSON.stringify({"users": [...book.users, {"id":1, "username":"pouros"}]})
    }

    fetch(`http://localhost:3000/books/${book.id}`, reqObj)
        .then(resp => {
            return resp.json()
        })
           .then(data => {
            bookInformation(data)
            document.querySelector('BUTTON').innerHTML = 'UNLIKE'
           }
              )
}

function goodByeBook(book){
    const reqObj ={
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({"users": book.users.filter(user => user.id !== 1)})
    }

    fetch(`http://localhost:3000/books/${book.id}`, reqObj)
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            bookInformation(data)
        })

}