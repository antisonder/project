import { writable } from 'svelte/store';

export interface User {
  id: number;
  username: string;
  name: string;
  avatar?: string;
}

export const currentUser = writable<User | null>(null);