import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

function AlertConfirmation({ children, stopinterview, isEnding }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        disabled={isEnding}
        className="cursor-pointer rounded-full bg-red-500 p-2.5 text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {children}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. Your interview will end.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isEnding}>Cancel</AlertDialogCancel>

          <AlertDialogAction disabled={isEnding} onClick={() => stopinterview?.()}>
            {isEnding ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isEnding ? "Ending..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertConfirmation;
