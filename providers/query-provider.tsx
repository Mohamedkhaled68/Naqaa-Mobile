import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

import NetworkUtils from "@/lib/NetworkUtils";

export function QueryProvider({ children }: PropsWithChildren) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        retry: (failureCount, error) => {
                            // Don't retry network errors more than 2 times
                            if (NetworkUtils.isNetworkError(error)) {
                                return failureCount < 2;
                            }
                            // For other errors, retry up to 1 time
                            return failureCount < 1;
                        },
                        retryDelay: (attemptIndex) => {
                            // Exponential backoff: 1s, 2s, 4s...
                            return Math.min(1000 * 2 ** attemptIndex, 30000);
                        },
                        networkMode: "offlineFirst", // Allow queries when offline but with cached data
                    },
                    mutations: {
                        retry: (failureCount, error) => {
                            // Don't retry network errors for mutations
                            if (NetworkUtils.isNetworkError(error)) {
                                return false;
                            }
                            // For other errors, retry once
                            return failureCount < 1;
                        },
                        networkMode: "online", // Only allow mutations when online
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
