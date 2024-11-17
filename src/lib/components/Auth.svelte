<script lang="ts">
  import { currentUser } from '../stores/auth';
  import { createUser, getUser } from '../db/queries';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';

  let isLogin = true;
  let username = '';
  let password = '';
  let name = '';
  let error = '';

  async function handleSubmit() {
    error = '';
    
    if (isLogin) {
      const user = getUser(username, password);
      if (user) {
        currentUser.set(user);
      } else {
        error = 'Invalid username or password';
      }
    } else {
      try {
        const user = createUser(username, password, name);
        currentUser.set(user);
      } catch (e) {
        error = 'Username already taken';
      }
    }
  }
</script>

<div class="mx-auto max-w-sm p-6">
  <h2 class="mb-6 text-2xl font-bold">{isLogin ? 'Login' : 'Sign Up'}</h2>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <Input
        type="text"
        placeholder="Username"
        bind:value={username}
        required
      />
    </div>
    
    <div>
      <Input
        type="password"
        placeholder="Password"
        bind:value={password}
        required
      />
    </div>
    
    {#if !isLogin}
      <div>
        <Input
          type="text"
          placeholder="Display Name"
          bind:value={name}
          required
        />
      </div>
    {/if}
    
    {#if error}
      <p class="text-destructive text-sm">{error}</p>
    {/if}
    
    <Button type="submit" class="w-full">
      {isLogin ? 'Login' : 'Sign Up'}
    </Button>
    
    <p class="text-center text-sm">
      {isLogin ? "Don't have an account?" : "Already have an account?"}
      <button
        type="button"
        class="text-primary hover:underline"
        on:click={() => {
          isLogin = !isLogin;
          error = '';
        }}
      >
        {isLogin ? 'Sign Up' : 'Login'}
      </button>
    </p>
  </form>
</div>