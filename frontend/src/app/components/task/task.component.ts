import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Task } from '../../models/Task.model';
import { TaskStore } from '../../store/task.store';

@Component({
  selector: 'app-task',
  standalone: false,
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit {
  fb = inject(FormBuilder)
  store = inject(TaskStore)
  
  form!: FormGroup

  protected priorityOptions: string[] = ['high', 'medium', 'low']

  ngOnInit(): void {
    this.form = this.createForm();
  }

  protected processForm() {
    console.info(this.form.value)
    const newTask: Task = {
      id: '',
      ...this.form.value
    }
    this.store.addTaskDb(newTask)

    this.form = this.createForm(); // Avoid using.reset() as the select dropdown will be set to null, instead of the default value of low defined here
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: this.fb.control<string>(''),
      priority: this.fb.control<string>('low')
    })
  }
}
