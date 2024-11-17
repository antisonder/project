<script lang="ts">
  import { onMount } from 'svelte';
  import { currentUser } from './lib/stores/auth';
  import { getTweets } from './lib/db/queries';
  import type { Tweet } from './lib/db/queries';
  import TweetComponent from './lib/components/Tweet.svelte';
  import TweetForm from './lib/components/TweetForm.svelte';
  import Auth from './lib/components/Auth.svelte';

  let tweets: Tweet[] = [];

  async function loadTweets() {
    tweets = getTweets($currentUser?.id);
  }

  onMount(loadTweets);
</script>

<main class="mx-auto max-w-2xl">
  <header class="border-b border-border p-4">
    <h1 class="text-xl font-bold">Home</h1>
  </header>

  {#if $currentUser}
    <TweetForm on:tweet={loadTweets} />
    <div>
      {#each tweets as tweet (tweet.id)}
        <TweetComponent {...tweet} />
      {/each}
    </div>
  {:else}
    <Auth />
  {/if}
</main>