export interface Character {
  id?: string; // ✅ Optional for new ones
  name: string;
  systemPrompt: string;
  model: string;
  avatar: string;
}
