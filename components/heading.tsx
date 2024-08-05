'use client';

import telegramlogo from '@/public/telegram-logo.svg';
import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/dropdown';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal';
import { ArrowDownUp, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSwitch } from './theme-switch';
const Heading = () => {
  const path = usePathname();
  if (path === '/auth') return null;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <nav className=" lg:px-20 px-2 h-20 w-full bg-background flex items-center justify-between gap-8">
      <Link href={'#'}>
        <Chip color="secondary">创建</Chip>
      </Link>
      <input
        type="text"
        placeholder="搜索"
        className="w-full bg-primary-foreground focus:bg-primary-foreground/70 max-w-screen-lg h-12 rounded-full px-5 py-3 border-none outline-none"
      />
      <span className="flex items-center gap-5">
        <span className="hidden lg:flex cursor-pointer rounded-full h-12 w-12 justify-center items-center hover:bg-primary-foreground ">
          <ThemeSwitch />
        </span>
        <span className="hidden lg:flex cursor-pointer rounded-full h-12 w-12 justify-center items-center hover:bg-primary-foreground ">
          <Bell />
        </span>
        <span
          onClick={onOpen}
          className="hidden lg:flex cursor-pointer rounded-full h-12 w-12 justify-center items-center hover:bg-primary-foreground "
        >
          <ArrowDownUp />
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Modal Title
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam pulvinar risus non risus hendrerit venenatis.
                      Pellentesque sit amet hendrerit risus, sed porttitor quam.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam pulvinar risus non risus hendrerit venenatis.
                      Pellentesque sit amet hendrerit risus, sed porttitor quam.
                    </p>
                    <p>
                      Magna exercitation reprehenderit magna aute tempor
                      cupidatat consequat elit dolor adipisicing. Mollit dolor
                      eiusmod sunt ex incididunt cillum quis. Velit duis sit
                      officia eiusmod Lorem aliqua enim laboris do dolor
                      eiusmod. Et mollit incididunt nisi consectetur esse
                      laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                      deserunt nostrud ad veniam.
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" onPress={onClose}>
                      Action
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </span>
        <span className="cursor-pointer rounded-full h-12 w-12 flex justify-center items-center hover:bg-primary-foreground ">
          <Dropdown placement="bottom-start">
            <DropdownTrigger>
              <Avatar
                as="button"
                src={telegramlogo.src}
                className="transition-transform"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-bold">Signed in as</p>
                <p className="font-bold">@tonyreichert</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </span>
      </span>
    </nav>
  );
};

export default Heading;
