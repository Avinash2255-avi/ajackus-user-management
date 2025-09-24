const BASE = 'https://jsonplaceholder.typicode.com/users';


export async function fetchUsers() {
const res = await fetch(BASE);
if (!res.ok) throw new Error('Failed to fetch users');
return res.json();
}


export async function getUser(id) {
const res = await fetch(`${BASE}/${id}`);
if (!res.ok) throw new Error('Failed to fetch user');
return res.json();
}


export async function createUser(payload) {
const res = await fetch(BASE, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
if (!res.ok) throw new Error('Failed to create user');
return res.json();
}


export async function updateUser(id, payload) {
const res = await fetch(`${BASE}/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
if (!res.ok) throw new Error('Failed to update user');
return res.json();
}


export async function deleteUser(id) {
const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
if (!res.ok) throw new Error('Failed to delete user');
return res.ok;
}