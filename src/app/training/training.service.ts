import { Injectable } from '@angular/core';
import { Subject, Subscription, throwError } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap } from 'rxjs/operators';

import { Exercise } from './exercise.model';
import { UiService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private availableExercises = [];
  private runningExercise: Exercise;
  fbSubs: Subscription[] = [];

  availableExercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  runningExerciseChanged = new Subject<Exercise>();
  

  constructor(private firestore: AngularFirestore,
              private uiService: UiService) { }


  fetchAvailableExercises() {
    this.uiService.loading.next(true);
    this.fbSubs.push(
      this.firestore
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
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.availableExercisesChanged.next([...this.availableExercises]);
        this.uiService.loading.next(false)
      }, error => {
        this.availableExercisesChanged.next(null);
        this.uiService.openSnackBar(error.message);
        this.uiService.loading.next(false)
      })
    )  
  }

  fetchFinishedExercises() {
    this.fbSubs.push(
      this.firestore.collection('exercises').valueChanges().subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
      })
    )
  }

  cancelExercisesSubs() {
    this.fbSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(ex => ex.id == selectedId);
    this.runningExerciseChanged.next({...this.runningExercise});
  }

  completeExercise() { 
    this.playSound();
    this.addToDatabase({
      ...this.runningExercise, 
      date: new Date().toString(), 
      state: 'completed'
    });
    this.runningExercise = null;
    this.runningExerciseChanged.next(null); 
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
    this.runningExerciseChanged.next(null);
  }

  getRunningExercise() {
    return {...this.runningExercise};
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
