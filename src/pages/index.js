"use strict";

import "./index.css";
import "../block/checklist/checklist.css"
import Api from "../components/Api";

const api = new Api({
  baseUrl: "https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users",
  headers: {
    authorization: "a8ffb240-ff73-4a9e-8ad1-0029aba72e90",
    "Content-Type": "application/json",
  },
});
const usersContainer = document.getElementById("users_container");
const searchInput = document.getElementById("list_input");
const clearButton = document.querySelector(".list__clear");
const sortByDateButton = document.querySelector(".table__date");
const sortByRatingButton = document.querySelector(".table__rating");
const prevPageButton = document.getElementById("prev_page");
const nextPageButton = document.getElementById("next_page");
const deleteButton = document.querySelector(".popup__button");
let sortByDateAsc = true;
let sortByRatingAsc = true;
let originalUsers = [];
const usersPerPage = 5;
let currentPage = 1;

api
  .fetchUsers()
  .then((data) => {
    originalUsers = data;
    pagination();
  })
  .catch((error) => {
    console.error("Ошибка при получении данных:", error);
  });

function renderUsers(users) {
  usersContainer.innerHTML = "";

  users.forEach((user) => {
    const userDiv = document.createElement("div");
    userDiv.classList.add("checklist__main");
    userDiv.setAttribute("data-user-id", user.id); // Добавляем атрибут с идентификатором пользователя

    const usernameElement = document.createElement("h5");
    usernameElement.classList.add("checklist__username");
    usernameElement.textContent = `Username: ${user.username}`;
    userDiv.appendChild(usernameElement);

    const emailElement = document.createElement("h5");
    emailElement.classList.add("checklist__email");
    emailElement.textContent = `Email: ${user.email}`;
    userDiv.appendChild(emailElement);

    const registrationElement = document.createElement("h5");
    registrationElement.classList.add("checklist__registration");
    registrationElement.textContent = `Registration Date: ${user.registration_date}`;
    userDiv.appendChild(registrationElement);

    const ratingElement = document.createElement("h5");
    ratingElement.classList.add("checklist__rating");
    ratingElement.textContent = `Rating: ${user.rating}`;
    userDiv.appendChild(ratingElement);

    const cancelElement = document.createElement("button");
    cancelElement.classList.add("checklist__cancel");
    cancelElement.addEventListener("click", openDeleteConfirmationPopup);
    userDiv.appendChild(cancelElement);

    usersContainer.appendChild(userDiv);

    const borderElement = document.createElement("div");
    borderElement.classList.add("checklist__border");
    usersContainer.appendChild(borderElement);
  });
}

searchInput.addEventListener("input", () => {
  const searchQuery = searchInput.value.trim().toLowerCase();

  let filteredUsers;

  if (searchQuery !== "") {
    filteredUsers = originalUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery) ||
        user.email.toLowerCase().includes(searchQuery)
    );
  } else {
    filteredUsers = originalUsers;
  }

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const usersToRender = filteredUsers.slice(startIndex, endIndex);

  renderUsers(usersToRender);

  const maxPage = Math.ceil(filteredUsers.length / usersPerPage);
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled =
    currentPage === maxPage || usersToRender.length < usersPerPage;
});

clearButton.addEventListener("click", () => {
  searchInput.value = "";
  currentPage = 1;

  if (searchInput.value.trim() !== "") {
    const searchQuery = searchInput.value.trim().toLowerCase();

    const filteredUsers = originalUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery) ||
        user.email.toLowerCase().includes(searchQuery)
    );

    originalUsers = filteredUsers.slice(0, usersPerPage);
  }

  pagination();
});

sortByDateButton.addEventListener("click", () => {
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

  originalUsers = sortedUsers;
  currentPage = 1;
  pagination();

  sortByDateButton.classList.toggle("active");
  sortByRatingButton.classList.remove("active");
});

sortByRatingButton.addEventListener("click", () => {
  sortByRatingAsc = !sortByRatingAsc;

  const sortedUsers = [...originalUsers].sort((a, b) => {
    if (sortByRatingAsc) {
      return a.rating - b.rating;
    } else {
      return b.rating - a.rating;
    }
  });

  originalUsers = sortedUsers;
  currentPage = 1;
  pagination();

  sortByRatingButton.classList.toggle("active");
  sortByDateButton.classList.remove("active");
});

prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    pagination();
  }
});

nextPageButton.addEventListener("click", () => {
  const maxPage = Math.ceil(originalUsers.length / usersPerPage);
  if (currentPage < maxPage) {
    currentPage++;
    pagination();
  }
});

function pagination() {
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const usersToRender = originalUsers.slice(startIndex, endIndex);

  renderUsers(usersToRender);

  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled =
    currentPage === Math.ceil(originalUsers.length / usersPerPage);
}

function openDeleteConfirmationPopup(event) {
  const userId = event.target.closest(".checklist__main").dataset.userId;
  const popup = document.getElementById("popup");
  popup.classList.add("popup__active");
  popup.dataset.userId = userId;
}

function closeDeleteConfirmationPopup() {
  const popup = document.getElementById("popup");
  popup.classList.remove("popup__active");
}

deleteButton.addEventListener("click", (event) => {
  event.preventDefault();
  const userId = document.getElementById("popup").dataset.userId;
  deleteUser(userId);

  closeDeleteConfirmationPopup();
});

const cancelButton = document.querySelector(".popup__button-cancel");
cancelButton.addEventListener("click", (event) => {
  event.preventDefault();
  closeDeleteConfirmationPopup();
});

function deleteUser(userId) {
  const userIndex = originalUsers.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    originalUsers.splice(userIndex, 1);
    pagination();
  }
}
