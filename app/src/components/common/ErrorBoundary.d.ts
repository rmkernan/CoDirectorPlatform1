import { FC, ReactNode } from 'react';

declare const ErrorBoundary: FC<{
  fallback: ReactNode;
  children: ReactNode;
}>;

export default ErrorBoundary;
