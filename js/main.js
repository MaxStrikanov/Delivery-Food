'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login'); 
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRest = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title') ;
const rating = document.querySelector('.rating'); 
const minprice = document.querySelector('.price');
const category = document.querySelector('.category');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const clearCart = document.querySelector('.clear-cart');
const inputSearch = document.querySelector('.input-search');

let login = localStorage.getItem('login');

const cart = [];

const getData = async (url) =>  {
  
  const response = await fetch(url);
  if(!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, 
    статус ошибки ${response.status}!`);
  }
 return await response.json();
  
};


const valid = (str) =>{
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
};


const toggleModal = () => {
  modal.classList.toggle('is-open');
  loginInput.style.BorderColor = '';
};

const toggleModalAuth = () => {
  loginInput.style.borderBottomColor = '';
  modalAuth.classList.toggle('is-open');
};

const returnMain = () => {
    containerPromo.classList.remove('hide')
    restaurants.classList.remove('hide')
    menu.classList.add('hide')  
};

function authorized() {

  function logOut(){
    login = null;
    localStorage.removeItem('login');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    loginForm.reset();
  
    checkAuth();
    returnMain();
  }

  console.log("Авторизован");

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
};

function notAuthorized() {
  console.log("Не авторизован");


function logIn(e){
    e.preventDefault();

  if (valid(loginInput.value)){
    login = loginInput.value;
    localStorage.setItem('login', login);
    toggleModalAuth();
    buttonAuth.removeEventListener('click', toggleModalAuth);
    closeAuth.removeEventListener('click', toggleModalAuth);
    loginForm.removeEventListener('submit', logIn);
    checkAuth();
  } else {
    loginInput.style.borderBottomColor = 'red'; 
    loginInput.style.outlineStyle =  '0'; 
    loginInput.style.outline =  '0'; 
  }
}
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  loginForm.addEventListener('submit', logIn);
}

function checkAuth() {
    if (login) {
      authorized();
    } else {
      notAuthorized();
    }
}

//карточки ресторана
function createCardRest({name, time_of_delivery: timeOfDelivery, stars, 
  price, kitchen, image, products}) {

  const card = document.createElement('a');
  // card.classList.add('card');
  // card.classList.add('card-restaurant');
  card.className = 'card card-restaurant';
  card.products = products;
  card.info = [name, price, stars, kitchen];
  
  card.insertAdjacentHTML('beforeend', `
			<img src="${image}" alt="image" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title">${name}</h3>
					<span class="card-tag tag">${timeOfDelivery} мин</span></div>
				<div class="card-info">
					<div class="rating">${stars}</div>
					<div class="price">От ${price} ₽</div>
					<div class="category">${kitchen}</div>
				</div>
			</div>
  `);
  cardsRest.insertAdjacentElement('beforeend', card);
}


//Функция рендеринга карточек
function createCardGood({id,name,description,price,image}) {

  const card = document.createElement('div')

  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
						<img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">${description}
								</div>
							</div>
							<div class="card-buttons">
								<button class="button button-primary button-add-cart" id="${id}">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price card-price-bold">${price} ₽</strong>
							</div>
            </div>`);
  cardMenu.insertAdjacentElement('beforeend', card)
				
}

//функция открытие карточек
function openGoods(e) {
 const target =  e.target;
   if(login) {

     const restaurant = target.closest('.card-restaurant');
    
     if(restaurant) {
     
    const [name , price, stars, kitchen] = restaurant.info;

       cardMenu.textContent = '';
       containerPromo.classList.add('hide');
       restaurants.classList.add('hide');
       menu.classList.remove('hide');

       restaurantTitle.textContent = name;
       rating.textContent = stars;
       minprice.textContent = `От ${price} ₽`;
       category.textContent = kitchen;
  
       getData(`./db/${restaurant.products}`).then(function(data){
       data.forEach(createCardGood);
       });

    }else {
      toggleModalAuth();
    
    } 
  }
}

const addToCart = (e) => {

  const target = e.target;
  const buttonAddToCart = target.closest('.button-add-cart');
  if(buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;
    const food = cart.find(function(item){
      return item.id === id;
    })

  if (food) {
    food.count += 1;
  } else {
     cart.push({
      id,
      title,
      cost,
      count: 1
    });
  }
 }
} 
 
const renderCart = () => {
  modalBody.textContent = '';
  cart.forEach(({id,title,cost,count}) =>{
    const itemCart = `
    <div class="food-row">
					<span class="food-name">${title}</span>
					<strong class="food-price">${cost}</strong>
					<div class="food-counter">
						<button class="counter-button counter-minus" data-id ="${id}">-</button>
						<span class="counter">${count}</span>
						<button class="counter-button counter-plus" data-id ="${id}">+</button>
					</div>
        </div>`;

      modalBody.insertAdjacentHTML('afterbegin', itemCart);  
  });

  const totalPrice = cart.reduce((result, item) => {
  return result + parseFloat(item.cost)* item.count;
  }, 0);

  modalPrice.textContent = totalPrice + ' ₽';
  
}
  
const changeCount = (e) => {
  const target =  e.target;

  if(target.classList.contains('counter-button')) {
    const food = cart.find((item) =>{
      return item.id === target.dataset.id;
    });
  
  if(target.classList.contains('counter-minus')) {
    food.count--;
    if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
    }
  };

  if(target.classList.contains('counter-plus')) 
    food.count++;
    renderCart();
}
}

const init = () => {
  getData('./db/partners.json').then((data)=>{
    data.forEach(createCardRest)
  });
   cartButton.addEventListener("click", () => {
    
    renderCart();
    toggleModal();

  });

  clearCart.addEventListener('click', () => {
    cart.length = 0;
    renderCart();
  })

  modalBody.addEventListener('click', changeCount);

  cardsRest.addEventListener('click', openGoods);

  cardMenu.addEventListener('click', addToCart);
  
  logo.addEventListener('click', returnMain);
  
  inputSearch.addEventListener('keydown', (e) => {

    if(e.keyCode === 13) {
    const target = e.target;

    const value = target.value.toLowerCase().trim();
    
    target.value = '';

    if (!value || value.length < 2) {
      target.style.borderColor = 'tomato';
      setTimeout(() => {
        target.style.borderColor = '';
      }, 2000);
      return;
    }

    const goods = [];

    getData('./db/partners.json')
    .then((data) => {
       
      const products = data.map((item) => {
        return item.products;
      });

      products.forEach((product) => {
        getData(`./db/${product}`)
        .then((data) => {
          goods.push(...data) 

          const seachGoods = goods.filter((item) => {
            return item.name.toLowerCase().includes(value)
          })

          console.log(seachGoods);

          cardMenu.textContent = '';
          containerPromo.classList.add('hide');
          restaurants.classList.add('hide');
          menu.classList.remove('hide');

          restaurantTitle.textContent = 'Результат поиска';
          rating.textContent = '';
          minprice.textContent = '';
          category.textContent = '';

          return seachGoods;

        })
        .then((data) => {
          data.forEach(createCardGood);
        })
      });
      
        
    })
    
   
      
    };
  })
  
  close.addEventListener("click", toggleModal);
  
  checkAuth();
  
  new Swiper('.swiper-container', {
    loop: true, 
    autoplay: {
      delay: 5000
    },
    slidesPerView: 1, 
    slidesPerColumn: 1,
  })
}
init();

