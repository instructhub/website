import { Icon } from "@iconify/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar className="top-14 bg-mantle">
      <SidebarHeader className="bg-crust text-xl font-bold">
        Stages
      </SidebarHeader>
      <SidebarContent className="bg-crust p-2 pl-6">
        <Accordion type="multiple" defaultValue={["item-1"]}>
          <AccordionItem value="item-1">
            <AccordionTrigger className="hover:no-underline py-0">
              <ContextMenu>
                <ContextMenuTrigger className="grow px-3 py-1 hover:bg-base text-left rounded-md text-md font-bold mr-1">
                  Introduction to next.js
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>
                    <div className="flex space-x-1 items-center">
                      <Icon icon="lucide:square-plus" />
                      <p>New item</p>
                    </div>
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <div className="flex space-x-1 items-center">
                      <Icon icon="lucide:edit" />
                      <p>Rename</p>
                    </div>
                  </ContextMenuItem>

                  <ContextMenuSeparator />

                  <ContextMenuItem>
                    <div className="flex space-x-1 items-center text-red">
                      <Icon icon="lucide:trash-2" />
                      <p>Delete</p>
                    </div>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </AccordionTrigger>
            <AccordionContent className="pl-4 flex-col pb-0">
              <ContextMenu>
                <ContextMenuTrigger>
                  <div className="hover:bg-base hover:border-l-4 hover:border-lavender border-l-4 border-crust pl-5 p-2 rounded-md space-y-1">
                    <div className="text-text flex space-x-2">
                      <Icon
                        icon="lucide:book-open"
                        width="1rem"
                        height="1rem"
                        className="shrink-0 mt-0.5"
                      />
                      <div className="text-wrap flex-1">
                        What is next.js and why you should learn it and why it
                        is the suckest framework
                      </div>
                    </div>
                    <p className="text-subtext0 text-xs">2 mins</p>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>
                    <div className="flex space-x-1 items-center">
                      <Icon icon="lucide:arrow-up" />
                      <p>Move up</p>
                    </div>
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <div className="flex space-x-1 items-center">
                      <Icon icon="lucide:arrow-down" />
                      <p>Move down</p>
                    </div>
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <div className="flex space-x-1 items-center">
                      <Icon icon="lucide:edit" />
                      <p>Rename</p>
                    </div>
                  </ContextMenuItem>

                  <ContextMenuSeparator />

                  <ContextMenuItem>
                    <div className="flex space-x-1 items-center text-red">
                      <Icon icon="lucide:trash-2" />
                      <p>Delete</p>
                    </div>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>

              <div className="hover:bg-base hover:border-l-4 hover:border-lavender border-l-4 border-crust pl-5 p-2 rounded-md space-y-1">
                <div className="text-text flex space-x-2  items-center">
                  <Icon icon="lucide:book-open" width="1rem" height="1rem" />
                  <div>What is next.js</div>
                </div>
                <p className="text-subtext0 text-xs">2 mins</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="hover:no-underline py-0">
              <ContextMenu>
                <ContextMenuTrigger className="grow px-3 py-1 hover:bg-base text-left rounded-md text-md font-bold mr-1">
                  Introduction to next.js
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>
                    <div className="flex space-x-1 items-center">
                      <Icon icon="lucide:square-plus" />
                      <p>New item</p>
                    </div>
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <div className="flex space-x-1 items-center">
                      <Icon icon="lucide:edit" />
                      <p>Rename</p>
                    </div>
                  </ContextMenuItem>

                  <ContextMenuSeparator />

                  <ContextMenuItem>
                    <div className="flex space-x-1 items-center text-red">
                      <Icon icon="lucide:trash-2" />
                      <p>Delete</p>
                    </div>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </AccordionTrigger>
            <AccordionContent className="pl-4 flex-col pb-0">
              <div className="hover:bg-base hover:border-l-4 hover:border-lavender border-l-4 border-crust pl-5 p-2 rounded-md space-y-1">
                <div className="text-text flex space-x-2  items-center">
                  <Icon icon="lucide:play" width="1rem" height="1rem" />
                  <div>What is next.js</div>
                </div>
                <p className="text-subtext0 text-xs">2 mins</p>
              </div>
              <div className="hover:bg-base hover:border-l-4 hover:border-lavender border-l-4 border-crust pl-5 p-2 rounded-md space-y-1">
                <div className="text-text flex space-x-2  items-center">
                  <Icon icon="lucide:book-open" width="1rem" height="1rem" />
                  <div>What is next.js</div>
                </div>
                <p className="text-subtext0 text-xs">2 mins</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <button className="rounded-md border-dashed border-2 justify-center items-center p-2 ml-1">
          <div className="flex space-x-2 items-center justify-center text-overlay0">
            <Icon icon="lucide:square-plus" />
            <div className="font-bold text-sm">New stage</div>
          </div>
        </button>
      </SidebarContent>
    </Sidebar>
  );
}
