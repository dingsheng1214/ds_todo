import DB from './db.js';

const db = new DB()

async function add(title) {
    await db.insert({title, done: false})
}

async function clear() {
    await db.clear()
}

async function showAll() {
    return await db.getAllTodos()
}

async function update(id, done) {
    return await db.update(id, done)
}

async function remove(id) {
    return await db.remove(id)
}

export {add, clear, showAll, update, remove}

