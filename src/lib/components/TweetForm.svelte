<script lang="ts">
  import { currentUser } from '../stores/auth';
  import { createTweet } from '../db/queries';
  import { Button } from '$lib/components/ui/button';
  import { Textarea } from '$lib/components/ui/textarea';
  
  let content = '';
  let isSubmitting = false;

  async function handleSubmit() {
    if (!content.trim() || !$currentUser) return;
    
    isSubmitting = true;
    const tweet = createTweet($currentUser.id, content.trim());
    if (tweet) {
      content = '';
      // Dispatch an event to refresh the tweet list
      dispatch('tweet');
    }
    isSubmitting = false;
  }

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<form
  class="border-b border-border p-4"
  on:submit|preventDefault={handleSubmit}
>
  <Textarea
    bind:value={content}
    placeholder="What's happening?"
    class="mb-2 border-none bg-transparent text-xl resize-none focus-visible:ring-0"
    rows="3"
  />
  <div class="flex justify-end">
    <Button
      type="submit"
      disabled={!content.trim() || isSubmitting}
      class="rounded-full"
    >
      Tweet
    </Button>
  </div>
</form>