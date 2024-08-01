import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
/// this is the same thing we did in the wild oasis project , but here we put the react query things in another file .
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

export const QueryProvidor = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
