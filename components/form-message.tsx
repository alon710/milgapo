export type Message = { success: string } | { error: string } | { message: string };

export function FormMessage({ message }: { message: Message }) {
    return (
        <div className="flex flex-col gap-2 w-full max-w-md text-sm">
            {"success" in message && (
                <div className="text-foreground dark:text-foreground-dark border-l-2 border-foreground dark:border-foreground-dark px-4">
                    {message.success}
                </div>
            )}
            {"error" in message && (
                <div className="text-destructive-foreground dark:text-destructive-foreground-dark border-l-2 border-destructive-foreground dark:border-destructive-foreground-dark px-4">
                    {message.error}
                </div>
            )}
            {"message" in message && (
                <div className="text-foreground dark:text-foreground-dark border-l-2 border-foreground dark:border-foreground-dark px-4">
                    {message.message}
                </div>
            )}
        </div>
    );
}
