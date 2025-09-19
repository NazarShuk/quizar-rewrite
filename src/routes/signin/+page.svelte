<script>
	import { Button } from '$lib/components/ui/button';
	import { SignIn } from '@auth/sveltekit/components';
</script>

<div class="flex h-screen w-full flex-col items-center justify-center">
	<h1>Sign in</h1>
	<SignIn provider="credentials" signInPage="signin">
		<div slot="submitButton"><Button>Sign in</Button></div>
	</SignIn>
</div>
