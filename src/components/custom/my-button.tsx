import { LoaderCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { Button } from '../ui/button';

export default function MyButton({
  text,
  children,
  className,
}: {
  text?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="default"
      disabled={pending}
      className={`space-x-2 ${className}`}>
      {pending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          <span>Process</span>
        </>
      ) : text ? (
        text
      ) : (
        'Submit'
      )}
      {children}
    </Button>
  );
}
