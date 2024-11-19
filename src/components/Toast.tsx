import React from "react";
import { AlertTriangle } from "lucide-react";
import { CSSTransition } from "react-transition-group";
import useSound from "use-sound";

interface ToastProps {
  message: string;
  isVisible: boolean;
}

const errorSound = "/error.mp3";

export default function Toast({ message, isVisible }: ToastProps) {
  const [playError] = useSound(errorSound, {
    volume: 0.5, // Adjust volume as needed
    soundEnabled: true, // Explicitly enable sound
  });

  React.useEffect(() => {
    if (isVisible) {
      try {
        playError();
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    }
  }, [isVisible, playError]);

  return (
    <CSSTransition
      in={isVisible}
      timeout={300}
      classNames={{
        enter: "toast-enter",
        enterActive: "toast-enter-active",
        exit: "toast-exit",
        exitActive: "toast-exit-active",
      }}
      unmountOnExit
    >
      <div className="toast flex items-center space-x-2 bg-red-50 text-red-700 border border-red-200">
        <AlertTriangle className="h-5 w-5" />
        <span>{message}</span>
      </div>
    </CSSTransition>
  );
}
