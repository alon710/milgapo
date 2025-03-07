import { Skeleton } from "@/components/ui/skeleton";

export function LoginFormSkeleton() {
    return (
        <div className="space-y-5 sm:space-y-4 animate-[pulse_2s_ease-in-out_infinite]">
            {/* Method selection buttons skeleton with staggered animation */}
            <div className="relative">
                <div className="flex justify-center gap-2 overflow-hidden">
                    <Skeleton className="h-[42px] sm:h-[36px] flex-1 rounded-md" />
                    <Skeleton className="h-[42px] sm:h-[36px] flex-1 rounded-md opacity-70 animate-[pulse_2.3s_ease-in-out_infinite]" />
                </div>
            </div>

            {/* Input field skeleton with delayed animation */}
            <Skeleton className="h-12 sm:h-10 w-full rounded-md animate-[pulse_2.5s_ease-in-out_infinite]" />

            {/* Submit button skeleton */}
            <Skeleton className="h-12 sm:h-10 w-full rounded-md animate-[pulse_2.7s_ease-in-out_infinite]" />

            {/* Divider skeleton */}
            <div className="pt-2">
                <div className="relative flex items-center py-3">
                    <div className="flex-grow h-px bg-muted/60" />
                    <Skeleton className="h-5 w-44 mx-4 rounded-sm animate-[pulse_3s_ease-in-out_infinite]" />
                    <div className="flex-grow h-px bg-muted/60" />
                </div>

                {/* Social buttons skeleton with staggered animation - wider buttons */}
                <div className="flex justify-center gap-3 mt-4">
                    <Skeleton className="h-12 sm:h-10 w-full max-w-[160px] rounded-md animate-[pulse_3.2s_ease-in-out_infinite]" />
                    <Skeleton className="h-12 sm:h-10 w-full max-w-[160px] rounded-md animate-[pulse_3.5s_ease-in-out_infinite]" />
                </div>
            </div>
        </div>
    );
}
