import { Skeleton } from "@/components/ui/skeleton";

export function OTPFormSkeleton() {
    return (
        <div className="space-y-5 sm:space-y-4 animate-[pulse_2s_ease-in-out_infinite]">
            {/* Error message skeleton (hidden by default) */}
            <div className="hidden">
                <Skeleton className="h-6 sm:h-5 w-4/5 mx-auto rounded-sm" />
            </div>

            {/* OTP input skeleton with pulse animation */}
            <div className="py-3 sm:py-1">
                <Skeleton className="h-12 sm:h-10 w-full rounded-md animate-[pulse_2.5s_ease-in-out_infinite]" />
            </div>

            {/* Submit button skeleton with delayed animation */}
            <div className="flex flex-col gap-3 mt-4 sm:mt-2">
                <Skeleton className="h-12 sm:h-10 w-full rounded-md animate-[pulse_2.7s_ease-in-out_infinite]" />
            </div>
        </div>
    );
}
