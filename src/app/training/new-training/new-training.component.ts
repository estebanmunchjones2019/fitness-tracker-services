import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
 

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  value: string;
  exercises: Exercise[];
  exercisesSubs: Subscription;
  isLoading: boolean = true;
  showButton: boolean = false;
  
  constructor(private trainingService: TrainingService,
              private firestore: AngularFirestore,
              private uiService: UiService) { } 

  ngOnInit(): void {
    this.fetchAvailableExercises();
  }

  onStartTraining(f: NgForm) {
    this.trainingService.startExercise(f.value.exercise);
  }

  ngOnDestroy() {
    if (this.exercisesSubs) {
      this.exercisesSubs.unsubscribe();
    }
  }

  fetchAvailableExercises() {
    this.exercisesSubs = this.trainingService.getAvailableExercises().subscribe((exercises: Exercise[]) => {
      this.isLoading = false;
      this.showButton = false;
      this.exercises = exercises;
    }, error => {
      this.isLoading = false;
      this.uiService.openSnackBar(error.message);
      this.showButton = true;
      });
  }

  onReload() {
    this.fetchAvailableExercises();
  }

}
