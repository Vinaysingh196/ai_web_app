import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Character } from '../shared/character.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: { sender: string; text: string }[] = [];
  userInput = '';
  isLoading = false;
  showCharacters = false; // Toggle for character settings

  selectedCharacter!: Character; // Holds the active character

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Load previously selected character from localStorage (optional)
    const saved = localStorage.getItem('selectedCharacter');
    if (saved) {
      this.selectedCharacter = JSON.parse(saved);
    }
  }

  // Triggered from <app-character-settings>
  onCharacterSelected(char: Character) {
    this.selectedCharacter = char;
    localStorage.setItem('selectedCharacter', JSON.stringify(char)); // Optional auto-save
    console.log('Active character:', char);
  }

  async sendMessage() {
    if (!this.userInput.trim() || !this.selectedCharacter?.model) return;

    const prompt = this.userInput;
    this.messages.push({ sender: 'You', text: prompt });
    this.userInput = '';
    this.isLoading = true;

    try {
      const res: any = await this.http.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: this.selectedCharacter.model,
          messages: [
            { role: 'system', content: this.selectedCharacter.systemPrompt },
            { role: 'user', content: prompt }
          ]
        },
        {
          headers: new HttpHeaders({
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json'
          })
        }
      ).toPromise();

      const aiReply = res.choices?.[0]?.message?.content || '(No reply)';
      this.messages.push({ sender: this.selectedCharacter.name || 'AI', text: aiReply });
    } catch (err) {
      console.error(err);
      this.messages.push({ sender: 'AI', text: '(Error getting response or model not available)' });
    }

    this.isLoading = false;
  }
}
