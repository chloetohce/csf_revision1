import { Task } from "./Task.model";

export interface TaskSlice {
    tasks: Task[],
    audit: string[],
    priorityFilter: string
}