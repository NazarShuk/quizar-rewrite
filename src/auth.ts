import { SvelteKitAuth } from '@auth/sveltekit';
import Resend from '@auth/sveltekit/providers/resend';
import { prisma } from './prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const { handle } = SvelteKitAuth({
	providers: [Resend],
	adapter: PrismaAdapter(prisma)
});
