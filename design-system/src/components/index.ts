/**
 * TrustBoost Design System - Components Index
 * Point d'entrée centralisé pour tous les composants
 */

// Button
export { Button } from './Button';
export type { ButtonProps } from './Button';

// Card
export { 
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription
} from './Card';

export type { 
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
  CardTitleProps,
  CardDescriptionProps
} from './Card';

// Export par défaut pour usage rapide
export default {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
};