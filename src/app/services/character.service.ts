// src/app/services/character.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({ providedIn: 'root' })
export class CharacterService {
  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {}

 async saveCharacter(character: any) {
  const user = await this.afAuth.currentUser;
  if (!user) throw new Error('User not logged in');

  const docRef = this.afs
    .collection('users')
    .doc(user.uid)
    .collection('characters')
    .doc(character.id); // use known ID

  return docRef.set({
    ...character,
    createdAt: new Date()
  });
}


 async getCharacters(): Promise<any[]> {
  const user = await this.afAuth.currentUser;
  if (!user) throw new Error('User not logged in');

  const snapshot = await this.afs
    .collection('users')
    .doc(user.uid)
    .collection('characters')
    .get()
    .toPromise();

  if (!snapshot || snapshot.empty) return [];

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


  async deleteCharacter(id: string) {
  const user = await this.afAuth.currentUser;
  if (!user) throw new Error('User not logged in');

  return this.afs
    .collection('users')
    .doc(user.uid)
    .collection('characters')
    .doc(id)
    .delete();
}

}
