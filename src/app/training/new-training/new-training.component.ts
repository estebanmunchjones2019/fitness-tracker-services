import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  value: string;
  exercises: Observable<any>;
  
  constructor(private trainingService: TrainingService,
              private firestore: AngularFirestore) { }

  ngOnInit(): void {
   this.exercises = this.trainingService.getAvailableExercises();
  }

  onStartTraining(f: NgForm) {
    this.trainingService.startExercise(f.value.exercise);
  }

}
