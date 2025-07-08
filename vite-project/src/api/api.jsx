// src/api/api.js
const USERS_API = 'https://jsonplaceholder.typicode.com/users';
const COMMENTS_API = 'https://jsonplaceholder.typicode.com/comments';

export const fetchUser  = async () => {
    const response = await fetch(USERS_API);
    const data = await response.json();
    return data[0]; // Return the first user
};

export const fetchComments = async () => {
    const response = await fetch(COMMENTS_API);
    const data = await response.json();
    return data; // Return all comments
};
