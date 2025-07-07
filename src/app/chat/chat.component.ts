import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  systemPrompt: string = 'You are Aira, an AI roleplay companion who is flirty, expressive, and always stays in character.';
  modelOptions: { name: string, value: string }[] = [];
  selectedModel = '';
  messages: { sender: string, text: string }[] = [];
  userInput = '';
  isLoading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadModels();
  }

  loadModels() {
    this.http.get<any>('https://openrouter.ai/api/v1/models').subscribe({
      next: (res) => {
        const freeModels = res.data.filter((m: any) => {
  const promptPrice = m?.pricing?.prompt;
  return !promptPrice || promptPrice === "0";
});
       console.log('Selected model set to:', freeModels);

        this.modelOptions = freeModels.map((m: any) => ({
          name: m.name,
          value: m.id
        }));

        if (this.modelOptions.length > 0) {
          this.selectedModel = this.modelOptions[0].value;
          console.log('Selected model set to:', this.selectedModel);
        }
      },
      error: (err) => {
        console.error('Failed to fetch models:', err);
      }
    });
  }

  async sendMessage() {
    if (!this.userInput.trim() || !this.selectedModel) return;

    const prompt = this.userInput;
    this.messages.push({ sender: 'You', text: prompt });
    this.userInput = '';
    this.isLoading = true;

    try {
      const res: any = await this.http.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: this.selectedModel,
          messages: [
            { role: 'system', content: this.systemPrompt },
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
      this.messages.push({ sender: 'Aira', text: aiReply });
    } catch (err) {
      console.error(err);
      this.messages.push({ sender: 'Aira', text: '(Error getting response or model not available)' });
    }

    this.isLoading = false;
  }
}
