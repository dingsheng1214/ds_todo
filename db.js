import fs from "fs/promises";
import path from "path";
import os from "os";

const home = process.env.HOME || os.homedir()
const todo_db_path = path.join(home, '.todo')

class DB {
    constructor(dbPath = todo_db_path) {
        this.dbPath = dbPath
    }

    async getAllTodos() {
        try {
            const data = await fs.readFile(this.dbPath, {encoding: 'utf8', flag: 'a+'})
            return JSON.parse(data.toString())
        } catch (e) {
            return []
        }
    }

    async insert(todo) {
        const list = await this.getAllTodos()
        list.push(todo)
        return await fs.writeFile(this.dbPath, JSON.stringify(list) +  '\n')
    }

    async clear() {
        return await fs.writeFile(this.dbPath, JSON.stringify([]) +  '\n')
    }

    async update(id, done) {
        const list = await this.getAllTodos()
        list[id].done = done
        return await fs.writeFile(this.dbPath, JSON.stringify(list) +  '\n')
    }

    async remove(id) {
        const list = await this.getAllTodos()
        list.splice(id, 1)
        return await fs.writeFile(this.dbPath, JSON.stringify(list) +  '\n')
    }

}

export default DB
