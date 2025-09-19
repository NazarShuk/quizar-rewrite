import { SvelteKitAuth } from '@auth/sveltekit';
import { prisma } from './prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from '@auth/sveltekit/providers/credentials';

export const { handle, signIn } = SvelteKitAuth({
	providers: [
		Credentials({
			credentials: {
				email: {
					type: 'email',
					label: 'Email',
					placeholder: 'totya@gmail.com'
				},
				password: {
					type: 'password',
					label: 'Password',
					placeholder: '*****'
				}
			}
		})
	],
	adapter: PrismaAdapter(prisma),
	pages: {
		signIn: '/signin'
	}
});
