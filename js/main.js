// Создаем переменную, в которую положим кнопку меню
let menuToggle = document.querySelector('#menu-toggle');
// Создаем переменную, в которую положим меню
let menu = document.querySelector('.sidebar');
// отслеживаем клик по кнопке меню и запускаем функцию
menuToggle.addEventListener('click', function (event) {
    // отменяем стандартное поведение ссылки
    event.preventDefault();
    // вешаем класс на меню, когда кликнули по кнопке меню
    menu.classList.toggle('visible');
})

const regExpValidEmail = /^\w+@\w+\.\w{2,}$/
const loginElem = document.querySelector('.login')
const loginForm = document.querySelector('.login-form')
const emailInput = document.querySelector('.login-email')
const passwordInput = document.querySelector('.login-password')
const loginSignup = document.querySelector('.login-signup')
const userElem = document.querySelector('.user')
const usernameElem = document.querySelector('.user-name')
const exitElem = document.querySelector('.exit')
const editElem = document.querySelector('.edit')
const editContainer = document.querySelector('.edit-box')
const editUsername = document.querySelector('.edit-username')
const editUPhotoURL = document.querySelector('.edit-photo')
const userAvatarElem = document.querySelector('.user-avatar')
const postsWrapper = document.querySelector('.posts')
const buttonNewPost = document.querySelector('.button-new-post')
const addPostElem = document.querySelector('.add-post')
const loginForget = document.querySelector('.login-forget')


const listUsers = [
    {
        id: '01',
        email: '1',
        password: '12345',
        displayName: 'AsdJS'
    },
    {
        id: '02',
        email: '2',
        password: '123456',
        displayName: 'zxc'
    },
]
console.log(listUsers);
const setUsers = {
    user: null,
    initUser(handler) {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.user = user
            } else {
                this.user = null
            }
            if (handler) handler()
        })
    },
    logIn(email, password, handler) {
        if (!regExpValidEmail.test(email)) return alert('email not valid')
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch(err => {
                const errCode = err.code;
                const errMessage = err.message
                if (errCode === 'auth/wrong-password') {
                    console.log(errMessage)
                    alert('wrong pass')
                } else if (errCode === 'auth/user-not-found') {
                    console.log(errMessage);
                    alert('user not found)))))')
                } else {
                    alert(errMessage)
                }
                console.log(err);
            })
    },
    logOut(handler) {
        firebase.auth().signOut()
    },
    signUp(email, password, handler) {
        if (!regExpValidEmail.test(email)) return alert('email not valid')
        if (emailInput.value.trim() && passwordInput.value.trim()) {
            firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .then(data => {this.editUser(email.split('@')[0], null, handler)})
                .catch(err => {
                    const errCode = err.code;
                    const errMessage = err.message
                    if (errCode === 'auth/weak-password') {
                        console.log(errMessage)
                        alert('week pass')
                    } else if (errCode === 'auth/email-already-in-use') {
                        console.log(errMessage);
                        alert('email use))')
                    } else {
                        alert(errMessage)
                    }
                    console.log(err);
                })

            // if (!this.getUser(email.trim())) {
            //     const displayName = email.split('@')[0]
            //     const user = {email, password, displayName}
            //     listUsers.push(user)
            //     this.auth(user)
            //     handler()
            // } else {
            //     alert('user with this email already exists')
            // }
        } else {
            alert('login and password!!!')
        }
    },
    editUser(displayName, photoURL, handler) {
       const user = firebase.auth().currentUser
        if(displayName) {
            if (photoURL) {
                user.updateProfile({
                    displayName,
                    photoURL
                }).then(handler)
            } else {
                user.updateProfile({
                    displayName
                }).then(handler)
            }
        }
    },
    auth(user) {
        this.user = user
    },
    sendForget(email) {
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                alert('pismo otparavleno')
            })
            .catch(err => {
                console.log(err)
            })
    }
}

loginForget.addEventListener('click', e => {
    e.preventDefault()
    setUsers.sendForget(emailInput.value)
})
const setPosts = {
    allPost: [
    ],
    addPost(title, text, tags, handler) {
        const post = {
            id: `postID${(+new Date()).toString(16)}`,
            title,
            text,
            tags: tags.split(',').map(item => item.trim()),
            author: {displayName: setUsers.user.displayName, photo: setUsers.user.photoURL},
            date: new Date().toLocaleDateString(),
            like: 'like',
            comments: 'commentx'
        }
        this.allPost.push(post)
        firebase.database().ref('post').set(this.allPost)
            .then(() => this.getPosts(handler))

    },
    getPosts(handler) {
        firebase.database().ref('post').on('value', shapshot => {
            this.allPost = shapshot.val() || []
            handler()
        })
    }
}


const toggleAuthDom = () => {
    const user = setUsers.user
    console.log('user ', user)
    if (user) {
        buttonNewPost.style.display = 'block'
        loginElem.style.display = 'none'
        userElem.style.display = ''
        usernameElem.textContent = user.displayName
        userAvatarElem.src = user.photoURL || userAvatarElem.src
    } else {
        buttonNewPost.style.display = ''
        loginElem.style.display = ''
        userElem.style.display = 'none'
        addPostElem.style.display = 'none'
        postsWrapper.style.display = 'block'
    }
}

const showAddPost = () => {
    addPostElem.style.display = 'block'
    postsWrapper.style.display = 'none'
}

const showAllPosts = () => {
    let postsHTML = ''
    setPosts.allPost.forEach((post, i, arr) => {
        const {title, text, like, comments, tags, author, date} = post
        postsHTML += `
     <section class="post">
        <div class="post-body">
          <h2 class="post-title">${title}</h2>
          <p class="post-text">${text}</p>
          <div class="tags">
          ${tags.map((item, index) => {
            console.log(item);
            return `
            <a href="#" class="tag">#${item}</a>`
        }).join('')}
          </div>
        </div>
        <div class="post-footer">
          <div class="post-buttons">
            <button class="post-button likes">
              <svg width="19" height="20" class="icon icon-like">
                <use xlink:href="img/icons.svg#like"></use>
              </svg>
              <span class="likes-counter">${like}</span>
            </button>
            <button class="post-button comments">
              <svg width="21" height="21" class="icon icon-comment">
                <use xlink:href="img/icons.svg#comment"></use>
              </svg>
              <span class="comments-counter">${comments}</span>
            </button>
            <button class="post-button save">
              <svg width="19" height="19" class="icon icon-save">
                <use xlink:href="img/icons.svg#save"></use>
              </svg>
            </button>
            <button class="post-button share">
              <svg width="17" height="19" class="icon icon-share">
                <use xlink:href="img/icons.svg#share"></use>
              </svg>
            </button>
          </div>
          <div class="post-author">
            <div class="author-about">
              <a href="#" class="author-username">${author.displayName}</a>
              <span class="post-time">${date}</span>
            </div>
            <a href="#" class="author-link"><img src="${author.photo}" alt="${author.photo}" class="author-avatar"></a>
          </div>
        </div>
      </section>
    `
    })
    postsWrapper.innerHTML = postsHTML
    addPostElem.style.display = 'none'
    postsWrapper.style.display = 'block'
}

const init = () => {
    loginForm.addEventListener('submit', e => {
        e.preventDefault()
        setUsers.logIn(emailInput.value, passwordInput.value, toggleAuthDom)
        loginForm.reset()
    })
    loginSignup.addEventListener('click', e => {
        e.preventDefault()
        setUsers.signUp(emailInput.value, passwordInput.value, toggleAuthDom)
        loginForm.reset()
    })

    exitElem.addEventListener('click', e => {
        e.preventDefault()
        setUsers.logOut(toggleAuthDom)
    })

    editElem.addEventListener('click', e => {
        e.preventDefault()
        editUsername.value = setUsers.user.displayName
        editUPhotoURL.value = setUsers.user.photoURL || 'default'
        editContainer.classList.toggle('visible')
    })

    editContainer.addEventListener('submit', e => {
        e.preventDefault()
        setUsers.editUser(editUsername.value, editUPhotoURL.value, toggleAuthDom)
        editContainer.classList.remove('visible')
    })

    buttonNewPost.addEventListener('click', e => {
        e.preventDefault()
        showAddPost()
    })

    addPostElem.addEventListener('submit', e => {
        e.preventDefault()
        const {title, text, tags} = addPostElem.elements
        if (title.value.length < 6) {
            alert('short title!')
            return
        }
        if (text.value.length < 6) {
            alert('short post!')
            return
        }
        setPosts.addPost(title.value, text.value, tags.value, showAllPosts)
        addPostElem.style.display = 'none'
        addPostElem.reset()
    })

    setUsers.initUser(toggleAuthDom)
    setPosts.getPosts(showAllPosts)
    showAllPosts()

}
document.addEventListener('DOMContentLoaded', () => {
    init()
})
