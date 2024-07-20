'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }

    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-900 to-indigo-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl 
          font-extrabold tracking-tight text-black mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="text-lg mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Email/Username</FormLabel>
                  <Input placeholder='sampale@gmail.com' {...field} 
                  className="rounded border-2 border-purple-400 focus:outline-none
                   focus:border-purple-500 px-3 py-2 mt-1" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-black'>Password</FormLabel>
                  <Input placeholder='password' type="password" {...field} 
                  className="rounded border-2 border-purple-400 
                  focus:outline-none focus:border-purple-500 px-3 py-2 mt-1" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full rounded-full bg-purple-600
             text-white font-semibold py-3 px-6 transition
              duration-300 ease-in-out transform hover:scale-105' 
            type="submit">Sign In</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-black">
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-400 hover:text-blue-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}