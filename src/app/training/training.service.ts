import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable, Subscription, throwError } from 'rxjs';
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

  constructor(private firestore: AngularFirestore) { }


  getAvailableExercises() {
    return this.firestore
    .collection('availableExercises')
    .snapshotChanges() 
    .pipe(
      map(docArray => {
        // throw(new Error('couldn get the data'))
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id, 
            ...doc.payload.doc.data() as {}
          } 
        })  
      }),
      tap(exercises  => {
        this.availableExercises= exercises;
      })
    )  
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(ex => ex.id == selectedId);
    this.exercise.next({...this.runningExercise});
  }

  completeExercise() { 
    this.playSound();
    this.addToDatabase({
      ...this.runningExercise, 
      date: new Date().toString(), 
      state: 'completed'
    });
    this.runningExercise = null;
    this.exercise.next(null); 
  }

  cancelExercise(progress: number) {
    const partialDuration = progress * this.runningExercise.duration / 100;
    const partialCalories = this.runningExercise.calories * progress / 100;
    this.addToDatabase({
      ...this.runningExercise, 
      duration: partialDuration,
      calories: partialCalories,
      date: new Date().toString(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exercise.next(null);
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }
  

  getExercises(): Observable<any> {
    return this.firestore.collection('exercises').valueChanges();
  }

  private addToDatabase(exercise: Exercise) {
    this.firestore.collection('exercises').add(exercise);
  }

  playSound(){
    var mp3Source = '<source src="/assets/alarm.mp3" type="audio/mpeg">';
    var embedSource = '<embed hidden="true" autostart="true" loop="false" src="/assets/alarm.mp3">';
    document.getElementById("sound").innerHTML='<audio autoplay="autoplay">' + mp3Source + embedSource + '</audio>';
  } 

}
