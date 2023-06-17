import "./index.css";
import Api from "../components/Api";

const api = new Api({
  baseUrl: "https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users",
  headers: {
    authorization: "a8ffb240-ff73-4a9e-8ad1-0029aba72e90",
    "Content-Type": "application/json",
  },
});
const usersContainer = document.getElementById('users_container');
const searchInput = document.getElementById('list_input');
const clearButton = document.querySelector('.list__clear');
const sortByDateButton = document.querySelector('.table__date');
const sortByRatingButton = document.querySelector('.table__rating');

let originalUsers = [];

api.fetchUsers()
  .then(data => {
    originalUsers = data;
    renderUsers(originalUsers);
  })
  .catch(error => {
    console.error('Ошибка при получении данных:', error);
  });

searchInput.addEventListener('input', () => {
  const searchQuery = searchInput.value.trim().toLowerCase();

  const filteredUsers = originalUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery) ||
    user.email.toLowerCase().includes(searchQuery)
  );

  renderUsers(filteredUsers);
});

clearButton.addEventListener('click', () => {
  searchInput.value = '';
  renderUsers(originalUsers);
});

function renderUsers(users) {
  usersContainer.innerHTML = '';

  users.forEach(user => {
    const userDiv = document.createElement('div');
    userDiv.classList.add('checklist__main');

    const usernameElement = document.createElement('h5');
    usernameElement.classList.add('checklist__username');
    usernameElement.textContent = `Username: ${user.username}`;
    userDiv.appendChild(usernameElement);

    const emailElement = document.createElement('h5');
    emailElement.classList.add('checklist__email');
    emailElement.textContent = `Email: ${user.email}`;
    userDiv.appendChild(emailElement);

    const registrationElement = document.createElement('h5');
    registrationElement.classList.add('checklist__registration');
    registrationElement.textContent = `Registration Date: ${user.registration_date}`;
    userDiv.appendChild(registrationElement);

    const ratingElement = document.createElement('h5');
    ratingElement.classList.add('checklist__rating');
    ratingElement.textContent = `Rating: ${user.rating}`;
    userDiv.appendChild(ratingElement);

    usersContainer.appendChild(userDiv);

    const borderElement = document.createElement('div');
    borderElement.classList.add('checklist__border');
    usersContainer.appendChild(borderElement);

    const cancelElement = document.createElement('button');
    cancelElement.classList.add('checklist__cancel');
    userDiv.appendChild(cancelElement);
  });
}

let sortByDateAsc = true;

sortByDateButton.addEventListener('click', () => {
  sortByDateAsc = !sortByDateAsc;

  const sortedUsers = [...originalUsers].sort((a, b) => {
    const dateA = new Date(a.registration_date);
    const dateB = new Date(b.registration_date);

    if (sortByDateAsc) {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  renderUsers(sortedUsers);

  sortByDateButton.classList.toggle('active');
  sortByRatingButton.classList.remove('active');
});

let sortByRatingAsc = true;

sortByRatingButton.addEventListener('click', () => {
  sortByRatingAsc = !sortByRatingAsc;

  const sortedUsers = [...originalUsers].sort((a, b) => {
    if (sortByRatingAsc) {
      return a.rating - b.rating;
    } else {
      return b.rating - a.rating;
    }
  });

  renderUsers(sortedUsers);

  sortByRatingButton.classList.toggle('active');
  sortByDateButton.classList.remove('active');
});

const usersPerPage = 5;
let currentPage = 1;
const prevPageButton = document.getElementById('prev_page');
const nextPageButton = document.getElementById('next_page');

prevPageButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    pagination();
  }
});

nextPageButton.addEventListener('click', () => {
  const maxPage = Math.ceil(originalUsers.length / usersPerPage);
  if (currentPage < maxPage) {
    currentPage++;
    pagination();
  }
});

function pagination() {
  usersContainer.innerHTML = '';

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const usersToRender = originalUsers.slice(startIndex, endIndex);

  usersToRender.forEach(user => {
  });

  const borderElement = document.createElement('div');
  borderElement.classList.add('checklist__border');
  usersContainer.appendChild(borderElement);

  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === Math.ceil(originalUsers.length / usersPerPage);
}

pagination();