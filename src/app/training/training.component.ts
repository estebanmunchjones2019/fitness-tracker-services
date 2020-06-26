import { Component, OnInit, OnDestroy } from '@angular/core';

import { TrainingService } from './training.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining: boolean = false;
  exerciseSubs: Subscription;
  
  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.exerciseSubs = this.trainingService.runningExerciseChanged.subscribe(ex => {
      if (ex != null) {
        this.ongoingTraining = true;
      } else {
        this.ongoingTraining = false;
      }
    })
  }

  onTrainingExit() {
    this.ongoingTraining = !this.ongoingTraining;
  }

  ngOnDestroy() {
    if (this.exerciseSubs) {
      this.exerciseSubs.unsubscribe();
    }
  }

}
