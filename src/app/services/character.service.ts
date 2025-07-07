import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({ providedIn: 'root' })
export class CharacterService {
  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {}

  async getCharacters(): Promise<any[]> {
    const user = await this.afAuth.currentUser;
    if (!user) throw new Error('User not logged in');

    const snapshot = await this.afs.collection(`users/${user.uid}/characters`).get().toPromise();
    if (!snapshot || snapshot.empty) return [];

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async saveCharacter(character: any) {
    const user = await this.afAuth.currentUser;
    if (!user) throw new Error('User not logged in');

    return this.afs
      .collection(`users/${user.uid}/characters`)
      .doc(character.id)
      .set({ ...character, updatedAt: new Date() });
  }

  async deleteCharacter(id: string) {
    const user = await this.afAuth.currentUser;
    if (!user) throw new Error('User not logged in');

    return this.afs
      .collection(`users/${user.uid}/characters`)
      .doc(id)
      .delete();
  }
}