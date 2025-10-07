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
    formData.append('id', id || '');
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <input type="hidden" name="redirectTo" value="/" />
        <Button className="mt-4 w-full" disabled={isPending} aria-disabled={isPending}>
          تسجيل الدخول
          {isPending
            ? <Spinner className="mr-auto h-5 w-5 text-gray-50" />
            : <ArrowLeftIcon className="mr-auto h-5 w-5 text-gray-50" />}
        </Button>
        {errorMessage && (
          <div className="mt-2 flex items-center text-red-500 text-sm">
            <ExclamationCircleIcon className="h-5 w-5 mr-1" />&nbsp;
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </form>
  );
}
// 'use client';

// import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
// import { ArrowRightIcon } from '@heroicons/react/20/solid';
// import { Button } from '@/app/components/button';
// import { useActionState } from 'react';
// import { authenticate } from '@/app/lib/actions';
// import { Spinner } from '@/app/components/spinner';

// export default function LoginForm() {
//   const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

//   return (
//     <form action={formAction} className="space-y-3">
//       <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
//         <h1 className={`mb-3 text-2xl`}>
//           Please log in to continue.
//         </h1>
//         <div className="w-full">
//           <label className="block text-xs font-medium text-gray-900" htmlFor="id">
//             ID
//           </label>
//           <input
//             className="mb-4 block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm"
//             id="id"
//             type="text"
//             name="id"
//             placeholder="Enter your user ID"
//             required
//           />
//           {/* <label className="block text-xs font-medium text-gray-900" htmlFor="password">
//             Password
//           </label>
//           <div className="relative">
//             <input
//               className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
//               id="password"
//               type="password"
//               name="password"
//               placeholder="Enter password"
//               required
//               minLength={6}
//             />
//             <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 text-gray-500" />
//           </div> */}
//         </div>
//         <input type="hidden" name="redirectTo" value="/" />
//         <Button className="mt-4 w-full" aria-disabled={isPending}>
//           Log in
//           {isPending
//             ? <Spinner className="ml-auto h-5 w-5 text-gray-50" />
//             : <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />}
//         </Button>
//         {errorMessage && (
//           <div className="mt-2 flex items-center text-red-500 text-sm">
//             <ExclamationCircleIcon className="h-5 w-5 mr-1" />
//             <p>{errorMessage}</p>
//           </div>
//         )}
//       </div>
//     </form>
//   );
// }
