'use client';

import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/kits/button';
import { startTransition, useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { Spinner } from '@/app/ui/kits/spinner';

export default function LoginForm({ id }: { id: string }) {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('id', id);
    formData.set('redirectTo', '/');
    startTransition(() => formAction(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 dark:bg-gray-800">
        <Button type="submit" className="mt-4 w-full" disabled={isPending} aria-disabled={isPending}>
          تسجيل الدخول
          {isPending
            ? <Spinner className="mr-auto h-5 w-5 text-gray-50" />
            : <ArrowLeftIcon className="mr-auto h-5 w-5 text-gray-50" />}
        </Button>
        {errorMessage && (
          <div className="mt-2 flex items-center text-red-500 text-sm" aria-live="polite">
            <ExclamationCircleIcon className="h-5 w-5 mr-1" />
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </form>
  );
}
