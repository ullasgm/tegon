/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from 'components/ui/resizable';
import { TooltipProvider } from 'components/ui/tooltip';

import { SideDrawer } from './side-drawer';
import { SidebarNav } from './sidebar-nav';

interface SettingsProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsProps) {
  return (
    <div className="md:flex flex-col flex-grow">
      <TooltipProvider delayDuration={0}>
        <div className="hidden md:block h-full">
          <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {
              document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                sizes,
              )}`;
            }}
            className="h-full max-h-[100%] items-stretch"
          >
            <ResizablePanel
              defaultSize={14}
              collapsible={false}
              minSize={14}
              maxSize={18}
            >
              <SidebarNav />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={30}>{children}</ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <SideDrawer />
      </TooltipProvider>
    </div>
  );
}
