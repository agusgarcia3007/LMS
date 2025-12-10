import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const SIDEBAR_WIDTH = "24rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";

type LearnLayoutContextProps = {
  leftOpen: boolean;
  setLeftOpen: (open: boolean) => void;
  rightOpen: boolean;
  setRightOpen: (open: boolean) => void;
  leftOpenMobile: boolean;
  setLeftOpenMobile: (open: boolean) => void;
  rightOpenMobile: boolean;
  setRightOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleLeft: () => void;
  toggleRight: () => void;
};

const LearnLayoutContext = React.createContext<LearnLayoutContextProps | null>(null);

export function useLearnLayout() {
  const context = React.useContext(LearnLayoutContext);
  if (!context) {
    throw new Error("useLearnLayout must be used within a LearnLayoutProvider.");
  }
  return context;
}

type LearnLayoutProviderProps = React.ComponentProps<"div"> & {
  defaultLeftOpen?: boolean;
  defaultRightOpen?: boolean;
};

export function LearnLayoutProvider({
  defaultLeftOpen = true,
  defaultRightOpen = false,
  className,
  style,
  children,
  ...props
}: LearnLayoutProviderProps) {
  const isMobile = useIsMobile();
  const [leftOpen, setLeftOpen] = React.useState(defaultLeftOpen);
  const [rightOpen, setRightOpen] = React.useState(defaultRightOpen);
  const [leftOpenMobile, setLeftOpenMobile] = React.useState(false);
  const [rightOpenMobile, setRightOpenMobile] = React.useState(false);

  const toggleLeft = React.useCallback(() => {
    if (isMobile) {
      setLeftOpenMobile((prev) => !prev);
    } else {
      setLeftOpen((prev) => !prev);
    }
  }, [isMobile]);

  const toggleRight = React.useCallback(() => {
    if (isMobile) {
      setRightOpenMobile((prev) => !prev);
    } else {
      setRightOpen((prev) => !prev);
    }
  }, [isMobile]);

  const contextValue = React.useMemo<LearnLayoutContextProps>(
    () => ({
      leftOpen,
      setLeftOpen,
      rightOpen,
      setRightOpen,
      leftOpenMobile,
      setLeftOpenMobile,
      rightOpenMobile,
      setRightOpenMobile,
      isMobile,
      toggleLeft,
      toggleRight,
    }),
    [leftOpen, rightOpen, leftOpenMobile, rightOpenMobile, isMobile, toggleLeft, toggleRight]
  );

  return (
    <LearnLayoutContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="learn-layout-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
              ...style,
            } as React.CSSProperties
          }
          className={cn("flex h-screen w-full flex-col overflow-hidden", className)}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </LearnLayoutContext.Provider>
  );
}
