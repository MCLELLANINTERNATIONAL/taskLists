# TypeScript Task List Application

## Overview

This Task List project was created to strengthen my understanding of TypeScript and how it improves reliability, structure, and maintainability in JavaScript-based applications. By building a practical application, I focused on learning how TypeScript supports stronger typing, modular code organization, and safer program design. 

The software I developed is a TypeScript Task List application that runs in the terminal. It allows users to manage tasks interactively by adding new tasks, creating subtasks, editing tasks, toggling completion status, deleting tasks, and viewing task statistics. All output is displayed directly in the terminal, demonstrating how a TypeScript application can operate as a command-line tool. Tasks are stored in lists and can contain nested subtasks, allowing the program to demonstrate recursion when searching, counting, or modifying tasks.

It also demonstrates several important programming concepts used in modern software development. Using classes to organize the task management and storage logic, lists to store collections of tasks and subtasks, and recursive functions to navigate nested task structures. Asynchronous functions are used to load and save tasks from a JSON file, ensuring that file operations do not block the application. The software also demonstrates throwing and handling exceptions, which helps ensure that invalid inputs and missing tasks are handled safely without crashing the program.

My purpose of creating this software was to gain hands-on experience with TypeScript syntax and language features while building a real, working application. By implementing multiple programming concepts together in a single project, I was able to enhance my understanding of how TypeScript can be used to create structured, reliable, and maintainable software.

## Software Demo

The project includes two ways to run the program:

1. Demo mode
   - Automatically demonstrates the required features
   - Prints output directly to the terminal

2. Interactive mode
   - Allows the user to manage the task list live in the terminal
   - Supports adding, editing, toggling, and deleting tasks

## Development Environment

- TypeScript
- Node.js
- Visual Studio Code
- GitHub
- JSON file storage

Task Lists software was developed using Visual Studio Code as the primary development environment. Built and tested locally using Node.js and managed using npm for dependency management. Git and GitHub were used for version control and to publish the project repository.

My programming language used in this project is TypeScript, which is a strongly typed superset of JavaScript. TypeScript allowed me to define types, interfaces, and classes that help prevent common programming errors, improving my code readability. Task Lists uses the Node.js runtime environment along with the built-in Node modules such as fs for file handling and readline for interactive terminal input. TypeScript compiler (tsc) was used to compile the TypeScript source code into JavaScript before execution.

## Useful Websites

- TypeScript Official Site https://www.typescriptlang.org/docs/handbook
- TypeScript for beginners https://youtu.be/d56mG7DezGs?si=NVWvJMccU0mzin1V
- TS for the New Programmer https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html
- TypeScript for JS Programmers https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html

# Future Work

There are several improvements that could be added to this project in the future to expand its functionality and usability.

   1. Add sorting options to organize tasks by priority or due date.

   2. Implement search functionality to quickly find tasks by keyword.

   3. Add automated unit tests using Jest to improve reliability.

   4. Improve the user interface and potentially build a web-based version of the task list.

   5. Add reminders or notifications for tasks with upcoming due dates.


## How to Run the Project

Install dependencies:
npm install
npm run demo (for demo)
npm run interactive (to interact with task list)