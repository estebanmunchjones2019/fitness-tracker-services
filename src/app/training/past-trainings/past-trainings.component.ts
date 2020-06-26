import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {
  exercises = new MatTableDataSource<Exercise>();
  displayedColumns: string[] = [ 'date', 'name', 'duration', 'calories', 'state'];
  finishedExercisesSubs: Subscription;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.finishedExercisesSubs = this.trainingService.finishedExercisesChanged.subscribe(exercises => {
      this.exercises.data = exercises;
    });
    this.trainingService.fetchFinishedExercises();
  }  

  ngAfterViewInit() {
    this.exercises.sort = this.sort;
    this.exercises.paginator = this.paginator;
    // can't access the template in ngOnInit() 
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.exercises.filter = filterValue.trim().toLowerCase();
    // trim to remove white spaces and to lowecarse because exercises are lowercased by angular in a long chain fo strings
  } 

}  
