<script lang="ts">
  import { format } from 'date-fns';
  import type { User } from '../stores/auth';
  import { currentUser } from '../stores/auth';
  import { toggleLike as toggleLikeQuery } from '../db/queries';
  import { Button } from '$lib/components/ui/button';
  import { Heart } from 'lucide-svelte';
  
  export let id: number;
  export let content: string;
  export let user: User;
  export let createdAt: string;
  export let likes: number = 0;
  export let isLiked: boolean = false;

  async function toggleLike() {
    if (!$currentUser) return;
    
    const newIsLiked = toggleLikeQuery($currentUser.id, id);
    isLiked = newIsLiked;
    likes += newIsLiked ? 1 : -1;
  }
</script>

<div class="border-b border-border p-4 hover:bg-muted/50">
  <div class="flex space-x-3">
    <img
      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
      alt={user.name}
      class="h-10 w-10 rounded-full"
    />
    <div class="flex-1">
      <div class="flex items-center space-x-2">
        <span class="font-bold">{user.name}</span>
        <span class="text-muted-foreground">@{user.username}</span>
        <span class="text-muted-foreground">·</span>
        <span class="text-muted-foreground">{format(new Date(createdAt), 'MMM d')}</span>
      </div>
      <p class="mt-1">{content}</p>
      <div class="mt-2 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          class="space-x-1 text-muted-foreground hover:text-primary"
          on:click={toggleLike}
        >
          <Heart
            class={isLiked ? 'fill-primary' : ''}
            size={18}
          />
          <span>{likes}</span>
        </Button>
      </div>
    </div>
  </div>
</div>