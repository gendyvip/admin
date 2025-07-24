import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function NavMain({ items }) {
  const [open, setOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Dummy emails for select
  const emails = [
    "support@dawaback.com",
    "advertise@dawaback.com",
    "contact@dawaback.com",
  ];

  const handleSend = () => {
    // TODO: implement send mail logic
    // Reset fields and close modal
    setOpen(false);
    setSelectedEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Mail System"
              className="text-primary shadow-sm bg-white border border-gray-200  min-w-8"
            >
              <span className="text-center mx-auto">Mail System</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
              onClick={() => setOpen(true)}
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* Modal for sending mail */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Send Quick Mail</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">From</label>
                <Input
                  value="admin@dawaback.com"
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">To</label>
                <Select value={selectedEmail} onValueChange={setSelectedEmail}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select email..." />
                  </SelectTrigger>
                  <SelectContent>
                    {emails.map((email) => (
                      <SelectItem key={email} value={email}>
                        {email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleSend}
                disabled={!selectedEmail || !subject || !message}
              >
                Send Mail
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = item.url === window.location.pathname;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={
                    isActive
                      ? "bg-black text-white hover:bg-black hover:text-white"
                      : ""
                  }
                >
                  <Link to={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
