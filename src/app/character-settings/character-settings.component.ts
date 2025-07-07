import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Character } from '../shared/character.model';
import { CharacterService } from '../services/character.service';

@Component({
  selector: 'app-character-settings',
  templateUrl: './character-settings.component.html',
  styleUrls: ['./character-settings.component.css']
})
export class CharacterSettingsComponent implements OnInit {
  @Output() characterSelected = new EventEmitter<Character>();

  characters: Character[] = [];
  currentCharacter: Character = { name: '', systemPrompt: '', model: '', avatar: '🤖' };
  selectedCharacterName: string = '';
  modelOptions: { name: string; value: string }[] = [];
  avatarOptions = ['🤖', '🧠', '👩‍🚀', '🧙‍♂️', '👸'];
  isEditing = false;
  showForm = false;

  constructor(private http: HttpClient, private characterService: CharacterService) {}

  ngOnInit(): void {
    this.loadModels();
    this.loadCharacters();
  }

  loadModels() {
    this.http.get<any>('https://openrouter.ai/api/v1/models').subscribe({
      next: (res) => {
        const freeModels = res.data.filter((m: any) => {
          const price = m?.pricing?.prompt;
          return !price || price === '0';
        });

        this.modelOptions = freeModels.map((m: any) => ({
          name: `${m.id.replace(/.*\//, '').replace(/:free$/, '')} (Free)`,
          value: m.id
        }));
      },
      error: (err) => console.error('Model loading failed', err)
    });
  }

  async loadCharacters() {
    try {
      const firebaseChars = await this.characterService.getCharacters();
      const localChars = localStorage.getItem('characters');
      this.characters = firebaseChars.length ? firebaseChars : (localChars ? JSON.parse(localChars) : []);
    } catch (err) {
      console.error('Error loading characters from Firestore:', err);
      const fallback = localStorage.getItem('characters');
      this.characters = fallback ? JSON.parse(fallback) : [];
    }
  }

  editCharacter(char: Character) {
    this.currentCharacter = { ...char }; // contains id
    this.isEditing = true;
    this.showForm = true;
  }

  newCharacter() {
    this.currentCharacter = { name: '', systemPrompt: '', model: '', avatar: '🤖' };
    this.isEditing = false;
    this.showForm = true;
  }

  async saveCharacter() {
    if (!this.currentCharacter.name.trim()) return;

    if (!this.currentCharacter.id) {
      this.currentCharacter.id = Date.now().toString();
      this.characters.push({ ...this.currentCharacter });
    } else {
      const index = this.characters.findIndex(c => c.id === this.currentCharacter.id);
      if (index >= 0) {
        this.characters[index] = { ...this.currentCharacter };
      }
    }

    localStorage.setItem('characters', JSON.stringify(this.characters));

    try {
      await this.characterService.saveCharacter(this.currentCharacter);
    } catch (err) {
      console.error('Error saving to Firestore:', err);
    }

    this.loadCharacters();
    this.showForm = false;
    this.isEditing = false;
  }

  selectCharacter(char: Character) {
    this.selectedCharacterName = char.name;
    this.currentCharacter = { ...char };
    localStorage.setItem('selectedCharacter', JSON.stringify(char));
    this.characterSelected.emit(char);
  }

 async deleteCharacter(id: string) {
  if (!confirm(`Delete this character?`)) return;

  this.characters = this.characters.filter(c => c.id !== id);
  localStorage.setItem('characters', JSON.stringify(this.characters));

  try {
    await this.characterService.deleteCharacter(id);
  } catch (err) {
    console.error('Failed to delete from Firestore:', err);
  }

  if (this.currentCharacter.id === id) {
    this.cancelForm();
  }
}

  resetForm() {
    this.currentCharacter = { name: '', systemPrompt: '', model: '', avatar: '🤖' };
    this.isEditing = false;
  }

  cancelForm() {
    this.showForm = false;
    this.isEditing = false;
  }
}


