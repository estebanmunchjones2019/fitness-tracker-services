import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap } from 'rxjs/operators';

import { Exercise } from './exercise.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private availableExercises = [];
  private runningExercise: Exercise;
  exercise = new Subject<Exercise>();
  private exercises: Exercise[] = [];

  constructor(private firestore: AngularFirestore) { }


  getAvailableExercises() {
    return this.firestore
    .collection('availableExercises')
    .snapshotChanges()
    .pipe(
      map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id, 
            ...doc.payload.doc.data() as {}
          }
        })
      }),
      tap(exercises => {
        this.availableExercises = exercises;
      })
    )
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(ex => ex.id == selectedId);
    this.exercise.next({...this.runningExercise});
  }

  completeExercise() {
    this.exercises.push({
      ...this.runningExercise, 
      date: new Date(), 
      state: 'completed'
    });
    this.runningExercise = null;
    this.exercise.next(null); 
  }

  cancelExercise(progress: number) {
    const partialDuration = progress * this.runningExercise.duration / 100;
    const partialCalories = this.runningExercise.calories * progress / 100;
    this.exercises.push({
      ...this.runningExercise, 
      duration: partialDuration,
      calories: partialCalories,
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exercise.next(null);
    console.log(this.exercises);
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  getExercises() {
    return [...this.exercises]; 
  }

}
