import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import ConfirmationDialog from '@/components/ConfirmationDialog';

interface SignOutDialogProps {
  trigger: React.ReactNode;
  onSignOut?: () => void;
  darkMode?: boolean;
}

export default function SignOutDialog({ trigger, onSignOut, darkMode }: SignOutDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();
    setIsOpen(false);
    onSignOut?.();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <div onClick={handleTriggerClick}>
        {trigger}
      </div>
      {createPortal(
        <ConfirmationDialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={handleSignOut}
          title="Sign Out"
          description="Are you sure you want to sign out of your account?"
          confirmLabel="Sign Out"
          variant="danger"
          icon={LogOut}
          darkMode={darkMode}
        />,
        document.body
      )}
    </>
  );
}
