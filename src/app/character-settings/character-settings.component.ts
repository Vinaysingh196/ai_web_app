import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Character } from '../shared/character.model';

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


  constructor(private http: HttpClient) {}

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

  loadCharacters() {
    const saved = localStorage.getItem('characters');
    this.characters = saved ? JSON.parse(saved) : [];
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

saveCharacter() {
  if (!this.currentCharacter.name.trim()) return;

  // If it's a new character (no ID), give it one
  if (!this.currentCharacter.id) {
    this.currentCharacter.id = Date.now().toString(); // or use UUID if needed
    this.characters.push({ ...this.currentCharacter });
  } else {
    // Edit existing character by ID
    const index = this.characters.findIndex(c => c.id === this.currentCharacter.id);
    if (index >= 0) {
      this.characters[index] = { ...this.currentCharacter };
    }
  }

  localStorage.setItem('characters', JSON.stringify(this.characters));
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

  deleteCharacter(id: string) {
  if (!confirm(`Delete this character?`)) return;
  this.characters = this.characters.filter(c => c.id !== id);
  localStorage.setItem('characters', JSON.stringify(this.characters));

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
