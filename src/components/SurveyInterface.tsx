import React from 'react';
import { EnhancedSurveyInterface } from './EnhancedSurveyInterface';

// Simple wrapper component that redirects to EnhancedSurveyInterface
export const SurveyInterface: React.FC = () => {
  return (
    <EnhancedSurveyInterface 
      onComplete={() => {}}
      onBack={() => {}}
      onReturnToLanding={() => {}}
    />
  );
};
