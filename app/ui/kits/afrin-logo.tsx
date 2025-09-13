import { GlobeAltIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { kufi } from '@/app/ui/fonts';

export default function AfrinLogo() {
  return (
    <div
      className={`${kufi.className} flex flex-row gap-2 items-center leading-none text-white`}
    >
      <BookOpenIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px]">معهد عفرين</p>
    </div>
  );
}
