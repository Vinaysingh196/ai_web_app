import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  systemPrompt: string = 'You are Aira, an AI roleplay companion who is flirty, expressive, and always stays in character.';
  messages: { sender: string, text: string }[] = [];
  userInput = '';
  isLoading = false;

  constructor(private http: HttpClient) {}

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const prompt = this.userInput;
    this.messages.push({ sender: 'You', text: prompt });
    this.userInput = '';
    this.isLoading = true;

    try {
      const res: any = await this.http.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mistral-7b-instruct:free',
          messages: [
          {
            role: 'system',
            content: this.systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
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
      this.messages.push({ sender: 'Aira', text: aiReply });
    } catch (err) {
      console.error(err);
      this.messages.push({ sender: 'Aira', text: '(Error getting response)' });
    }

    this.isLoading = false;
  }
}
