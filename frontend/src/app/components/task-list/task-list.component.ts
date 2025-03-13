import { Component, inject, OnInit } from '@angular/core';
import { TaskStore } from '../../store/task.store';
import { Observable } from 'rxjs';
import { Task } from '../../models/Task.model';

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  private store = inject(TaskStore)
  protected tasks$!: Observable<Task[]>

  protected allTasks$!: Observable<Task[]>

  protected priorities = ['high', 'medium', 'low', 'all']
  
  ngOnInit(): void {
    this.allTasks$ = this.store.getTasks
  }

  deleteTask(taskId: string) {
    this.store.removeTaskDb(taskId);
  }

  filter(priority: string) {
    this.store.setPriorityFilter(priority)
  }
}
