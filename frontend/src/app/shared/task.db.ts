import { Injectable } from "@angular/core";
import Dexie from 'dexie';
import { Task } from "../models/Task.model";


@Injectable(
    {providedIn: 'root'}
)
export class TaskDb extends Dexie {
    tasks : Dexie.Table<Task, string>;

    constructor() {
        super("TaskDb");
        this.version(1).stores({
            tasks: 'id'
        })
        this.tasks = this.table('tasks');
    }

    addTask(task: Task): Promise<Task> {
        console.log("adding, ", task)
        // add vs put: put upserts
        return this.tasks.put(task)
            .then(() => task)
    }

    removeTask(id: string) {
        this.tasks.delete(id);
        return id;
    }

    getAllTasks(): Promise<Task[]> {
        return this.tasks.toArray();
    }

}