#!/usr/bin/env node
import program from "commander";
import inquirer from "inquirer";
import pkg from "./package.json";
import {add, clear, showAll, update, remove} from './cli.js'


if (process.argv.length > 2) showCommand()

if (process.argv.length === 2) {
    //  展示todo列表
    await step_1();
}


// 展示命令
function showCommand() {
    // 布尔类型参数
    // program.option('-a, --xxx', 'what the x')

    // 命令 node index add ...
    program.command('add <taskName>')
        .description('add a task')
        .action(async (taskName) => {
            await add(taskName)
        })

    program.command('clear')
        .description('clear all tasks')
        .action(clear)

    program.parse(process.argv);
}

// 打印历史任务
async function step_1() {
    const todos = await showAll()
    const choice = await inquirer.prompt([
            {
                type: 'list',
                name: 'index',
                message: '请选择你想操作的任务',
                choices: [...todos.map(({done, title}, index)=> {
                    return {
                        name: `${done ? '[x]' : '[_]'}  ${index + 1} - ${title}`,
                        value: index.toString()
                    }
                }), {
                    name: '退出',
                    value: '-1'
                }, {
                    name: '创建任务',
                    value: '-2'
                }
                ]
            }
        ])
    // 2 对列表也的选择做出响应
    const  index  = parseInt(choice?.index)
    if (index >= 0) {
        // 选中一个任务
        await step_2(index)
    } else if (index === -1) {
        // 退出
        return
    } else if (index === -2) {
        // 创建新任务
        await handleAdd()
    }
}

// 处理选中的任务
async function step_2(id) {
    const selected = await inquirer.prompt([
        {
            type: 'list',
            name: 'index',
            message: '请选择操作',
            choices: [
                {name: '退出', value: 'quit'},
                {name: '已完成', value: 'markAsDone'},
                {name: '未完成', value: 'markAsUndone'},
                {name: '删除', value: 'remove'},
            ]
        }
    ])
    const { index = 'quit' } = selected
    if (index === 'markAsDone') {
        // 标记为已完成
        await update(id, true)
    } else if (index === 'markAsUndone') {
        // 标记为未完成
        await update(id, false)
    } else if (index === 'remove') {
        // 删除任务
        await remove(id)
    } else {
        return
    }
    await step_1()
}

// 处理新增任务
async function handleAdd() {
    const questions = [
        {
            type: 'input',
            name: 'taskName',
            message: "请输入任务名",
        }
    ];

    const input = await inquirer.prompt(questions)
    await add(input['taskName'])
    await step_1()
}
