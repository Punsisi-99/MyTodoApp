import { Component, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { provideHttpClient, HttpClient} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class App implements OnInit {
  protected readonly title = signal('todoapp');

  tasks:any[] = [];
  newtask = "";

  APIURL = 'http://localhost:8000/';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
  }

  ngOnInit () {
    this.get_tasks();
  }

  get_tasks(){
    this.http.get(this.APIURL + "get_tasks").subscribe((res)=>{
      this.tasks = res as any[];
      this.cdr.markForCheck();
    })
  }

  add_task(){
    if (!this.newtask.trim()) return;
    let body = new FormData();
    body.append("task", this.newtask);
    const taskName = this.newtask;
    this.http.post(this.APIURL + "add_task", body).subscribe({
      next: (res:any) => {
        this.tasks.push({ id: res.id || Date.now(), task: taskName });
        this.newtask = "";
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Add failed:', err)
    });
  }

  delete_task(id:any){
    let body = new FormData();
    body.append("id", id);
    this.http.post(this.APIURL + "delete_task", body).subscribe({
      next: (res:any) => {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Delete failed:', err)
    });
  }
}
