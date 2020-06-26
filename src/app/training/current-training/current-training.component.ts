import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { StopTrainingComponent } from './stop-training/stop-training.component';
import { TrainingService } from '../training.service';


@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  progress: number = 0;
  timer;

  constructor(public dialog: MatDialog,
              private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.initTimer();
  } 

  initTimer() {
    const step = this.trainingService.getRunningExercise().duration / 100 * 1000;
    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if (this.progress >= 100) {
        this.trainingService.completeExercise();
        clearInterval(this.timer); 
      }
    }, step)
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, 
      { 
        width: '250px',
        data: {progress: this.progress} 
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.initTimer();  
      }
      
    });
  }

  ngOnDestroy() {
  }
 
}
