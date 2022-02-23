import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import classnames from "classnames";
import { motion } from "framer-motion";

type ContentProps = {
  className?: string;
};

const Content: React.FC<Readonly<ContentProps>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay asChild>
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed top-0 left-0 w-screen h-screen bg-gray-400 bg-opacity-50"
          data-testid="dialog-overlay"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
        />
      </DialogPrimitive.Overlay>

      <DialogPrimitive.Content
        {...props}
        className={classnames(
          "focus:outline-none max-w-2xl w-full mx-auto fixed left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4",
          className
        )}
      >
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={classnames(
            "rounded shadow-md p-8 border",
            "bg-slate-100 border-gray-200",
            "max-h-[80vh] overflow-auto"
          )}
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
};

const Title: React.FC = ({ children }) => {
  return (
    <DialogPrimitive.Title className="text-lg font-medium text-cyan-800 m-0">
      {children}
    </DialogPrimitive.Title>
  );
};

const Description: React.FC = ({ children }) => {
  return (
    <DialogPrimitive.Description className="text-sm font-medium text-gray-600 mt-2 mb-6">
      {children}
    </DialogPrimitive.Description>
  );
};

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogContent = Content;
export const DialogTitle = Title;
export const DialogDescription = Description;
export const DialogClose = DialogPrimitive.Close;
