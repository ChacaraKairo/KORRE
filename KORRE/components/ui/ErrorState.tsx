import React from 'react';
import { AlertTriangle } from 'lucide-react-native';
import { EmptyState } from './EmptyState';

type ErrorStateProps = {
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
  isDark?: boolean;
};

export function ErrorState({
  title = 'Não foi possível carregar agora.',
  description = 'Verifique sua conexão ou tente novamente em instantes.',
  retryLabel = 'Tentar novamente',
  onRetry,
  isDark = true,
}: ErrorStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      actionLabel={onRetry ? retryLabel : undefined}
      onAction={onRetry}
      icon={AlertTriangle}
      isDark={isDark}
    />
  );
}
