<script lang="ts">
  import { Button as ButtonPrimitive } from "bits-ui";
  import { cn } from "$lib/utils";
  import { buttonVariants, type Props } from "./variants";

  type $$Props = Props;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<ButtonPrimitive.Root
  class={cn(buttonVariants({ variant, size }), className)}
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</ButtonPrimitive.Root>