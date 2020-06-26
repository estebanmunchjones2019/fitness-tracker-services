import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
 
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  
  exercises: Exercise[];
  exercisesSubs: Subscription;
  isLoading: boolean = false;
  isLoadingSubs: Subscription;
  
  constructor(private trainingService: TrainingService,
              private uiService: UiService) { } 

  ngOnInit(): void {
    this.exercisesSubs = this.trainingService.exercisesChanged.subscribe(exercises => {
      this.exercises = exercises;
    });
    this.isLoadingSubs = this.uiService.loading.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
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
    this.trainingService.getAvailableExercises()
  }

  onReload() {
    this.fetchAvailableExercises();
  }

}
