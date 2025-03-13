import { TaskSlice } from "../models/task-slice.model";
import { ComponentStore } from '@ngrx/component-store';
import { Task } from "../models/Task.model";
import { v4 as uuid } from 'uuid';
import { inject, Injectable, OnInit } from "@angular/core";
import { TaskDb } from "../shared/task.db";
import { catchError, concatMap, EMPTY, from, mergeMap, Observable, tap } from "rxjs";

const INIT_STATE: TaskSlice = {
    tasks: [],
    audit: [],
    priorityFilter: 'all'
}

@Injectable()
export class TaskStore extends ComponentStore<TaskSlice> {
    private db: TaskDb = inject(TaskDb)

    constructor() {
        super(INIT_STATE);

        this.db.getAllTasks()
            .then(list => list.forEach(
                task => this.addTask(task)
            ))
    }

    // mutator - update methods
    // addTask(task) == add task to the store list 
    readonly addTask = this.updater<Task>((slice: TaskSlice, newTask: Task) => {
        const toSave: Task = {
            ...newTask,
        }
        return {
            tasks: [...slice.tasks, toSave],
            audit: [...slice.audit, `${new Date().toLocaleDateString()}: Task ${toSave.id} added`],
            priorityFilter: slice.priorityFilter
        } as TaskSlice
    })

    readonly deleteTask = this.updater<string>((slice: TaskSlice, taskId: string) => {
        // Don't do this here. Use effects. After a successful value added to state, then trigger an effect.
        // If the mutator fails, then the effect won't be triggered. 
        // this.db.removeTask(taskId)

        return {
            tasks: [...slice.tasks.filter(task => task.id !== taskId)],
            audit: [...slice.audit, `${new Date().toLocaleDateString()}: Task ${taskId} deleted`],
            priorityFilter: slice.priorityFilter
        } as TaskSlice;
    })

    readonly setPriorityFilter = this.updater<string>((slice: TaskSlice, priorityFilter: string) => {
        return {
            tasks: [...slice.tasks],
            audit: [...slice.audit],
            priorityFilter: priorityFilter
        } as TaskSlice
    })

    // Selector
    readonly getTasks = this.select<Task[]>((slice: TaskSlice) => {
        return slice.tasks.filter(t => 
            slice.priorityFilter === 'all' || t.priority === slice.priorityFilter
        )
    })

    readonly getTaskCount = this.select<number>((slice: TaskSlice) => {
        return slice.tasks.length
    })

    readonly getTasks2 = (priority: string) => {
        return this.select<Task[]>
            ((slice: TaskSlice) => slice.tasks.filter(t => (priority === t.priority || priority === 'all')))
    }

    readonly addTaskDb = this.effect((task$: Observable<Task>) => 
        task$.pipe(
            mergeMap(newTask => {
                const toSave: Task = {
                    ...newTask,
                    id: uuid().substring(0, 8)
                }
                return from(this.db.addTask(toSave))
            }), 
            tap(newTask => this.addTask(newTask)),  
            catchError(() => EMPTY)
        )
    )

    readonly removeTaskDb = this.effect((taskId$: Observable<string>) => 
        taskId$.pipe(
            concatMap((id) => from(this.db.removeTask(id))),
            tap(id => this.deleteTask(id))
        )
    )
}