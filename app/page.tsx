'use client';

import { useTelegram } from '@/libs/hooks/useTelegram';
import { Card, CardBody } from '@nextui-org/card';
import { Tab, Tabs } from '@nextui-org/tabs';
import {
  Bookmark,
  BotIcon,
  FileText,
  Image,
  Music,
  RssIcon,
  UsersRoundIcon,
  Video,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const bufferToBase64 = (buffer: Buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export default function Home() {
  const telegram = useTelegram();
  const [imgsrc, setimgsrc] = useState('');
  useEffect(() => {
    if (telegram) {
      telegram.getPhoto().then((photo) => {
        console.log('photo', photo);
        const base64 = bufferToBase64(photo as unknown as Buffer);
        if (base64) {
          setimgsrc(`data:image/jpeg;base64,${base64}`);
        }
      });
    }
  }, [telegram]);
  return (
    <main className="flex flex-col flex-1">
      <section className="flex flex-col h-full last-child:h-full last-child:px-20 last-child:w-full">
        <Tabs
          aria-label="Options"
          radius="full"
          color="primary"
          variant="bordered"
          className="mx-auto"
        >
          <Tab
            key="bookmarks"
            title={
              <div className="flex items-center space-x-2 text-foreground">
                <Bookmark />
                <span className="hidden lg:block">Saved</span>
              </div>
            }
          >
            <Tabs
              aria-label="Options"
              isVertical={true}
              variant="underlined"
              classNames={{
                tabList: 'h-full w-full',
                tabContent: 'h-full w-full',
                wrapper: 'h-full w-full last-child:h-full last-child:w-full',
              }}
            >
              <Tab
                key="photos"
                title={
                  <div className="flex items-center space-x-2 text-foreground">
                    <Image />
                    <span className="hidden lg:block">Image</span>
                  </div>
                }
              >
                <Card className="h-full w-full">
                  <CardBody>
                    {imgsrc ? (
                      <img
                        src={imgsrc}
                        className="h-60 w-40"
                        alt="Image from Buffer"
                      />
                    ) : (
                      <p>Loading...</p>
                    )}
                  </CardBody>
                </Card>
              </Tab>
              <Tab
                key="music"
                title={
                  <div className="flex items-center space-x-2 text-foreground">
                    <Music />
                    <span className="hidden lg:block">Music</span>
                  </div>
                }
              >
                <Card className="h-full w-full">
                  <CardBody>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                    irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur.
                  </CardBody>
                </Card>
              </Tab>
              <Tab
                key="videos"
                title={
                  <div className="flex items-center space-x-2 text-foreground">
                    <Video />
                    <span className="hidden lg:block">Video</span>
                  </div>
                }
              >
                <Card className="h-full w-full">
                  <CardBody>
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </CardBody>
                </Card>
              </Tab>
              <Tab
                key="Documents"
                title={
                  <div className="flex items-center space-x-2 text-foreground">
                    <FileText />
                    <span className="hidden lg:block">Documents</span>
                  </div>
                }
              >
                <Card className="h-full w-full">
                  <CardBody>
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </Tab>
          <Tab
            key="photos"
            title={
              <div className="flex items-center space-x-2 text-foreground">
                <RssIcon />
                <span className="hidden lg:block">Channel</span>
              </div>
            }
          >
            <Tabs
              aria-label="Options"
              isVertical={true}
              variant="underlined"
              classNames={{
                tabList: 'h-full w-full',
                tabContent: 'h-full w-full',
                wrapper: 'h-full w-full last-child:h-full last-child:w-full',
              }}
            >
              <Tab
                key="photos"
                title={
                  <div className="flex items-center space-x-2 text-foreground">
                    <Image />
                    <span className="hidden lg:block">Image</span>
                  </div>
                }
              >
                <Card className="h-full w-full">
                  <CardBody>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </CardBody>
                </Card>
              </Tab>
              <Tab
                key="music"
                title={
                  <div className="flex items-center space-x-2 text-foreground">
                    <Music />
                    <span className="hidden lg:block">Music</span>
                  </div>
                }
              >
                <Card className="h-full w-full">
                  <CardBody>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                    irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur.
                  </CardBody>
                </Card>
              </Tab>
              <Tab
                key="videos"
                title={
                  <div className="flex items-center space-x-2 text-foreground">
                    <Video />
                    <span className="hidden lg:block">Video</span>
                  </div>
                }
              >
                <Card className="h-full w-full">
                  <CardBody>
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </CardBody>
                </Card>
              </Tab>
              <Tab
                key="Documents"
                title={
                  <div className="flex items-center space-x-2 text-foreground">
                    <FileText />
                    <span className="hidden lg:block">Documents</span>
                  </div>
                }
              >
                <Card className="h-full w-full">
                  <CardBody>
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </Tab>
          <Tab
            key="music"
            title={
              <div className="flex items-center space-x-2 text-foreground">
                <UsersRoundIcon />
                <span className="hidden lg:block">Group</span>
              </div>
            }
          >
            <Tabs
              aria-label="Options"
              isVertical={true}
              variant="underlined"
              classNames={{
                tabList: 'h-full w-full',
                tabContent: 'h-full w-full',
                wrapper: 'h-full w-full last-child:h-full last-child:w-full',
              }}
            >
              <Tab
                key="photos"
                title={
                  <div className="flex items-center space-x-2 text-foreground">
                    <Image />
                    <span className="hidden lg:block">Image</span>
                  </div>
                }
              >
                <Card className="h-full w-full">
                  <CardBody>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </CardBody>
                </Card>
              </Tab>
              <Tab
                key="music"
                title={
                  <div className="flex items-center space-x-2 text-foreground">
                    <Music />
                    <span className="hidden lg:block">Music</span>
                  </div>
                }
              >
                <Card className="h-full w-full">
                  <CardBody>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                    irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur.
                  </CardBody>
                </Card>
              </Tab>
              <Tab
                key="videos"
                title={
                  <div className="flex items-center space-x-2 text-foreground">
                    <Video />
                    <span className="hidden lg:block">Video</span>
                  </div>
                }
              >
                <Card className="h-full w-full">
                  <CardBody>
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </CardBody>
                </Card>
              </Tab>
              <Tab
                key="Documents"
                title={
                  <div className="flex items-center space-x-2 text-foreground">
                    <FileText />
                    <span className="hidden lg:block">Documents</span>
                  </div>
                }
              >
                <Card className="h-full w-full">
                  <CardBody>
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </Tab>
          <Tab
            key="videos"
            title={
              <div className="flex items-center space-x-2 text-foreground">
                <BotIcon />
                <span className="hidden lg:block">Bot</span>
              </div>
            }
          >
            <Tabs
              aria-label="Options"
              isVertical={true}
              variant="underlined"
              classNames={{
                tabList: 'h-full w-full',
                tabContent: 'h-full w-full',
                wrapper: 'h-full w-full last-child:h-full last-child:w-full',
              }}
            >
              <Tab
                key="photos"
                title={
                  <div className="flex items-center space-x-2 text-foreground">
                    <Image />
                    <span className="hidden lg:block">Image</span>
                  </div>
                }
              >
                <Card className="h-full w-full">
                  <CardBody>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </CardBody>
                </Card>
              </Tab>
              <Tab
                key="music"
                title={
                  <div className="flex items-center space-x-2 text-foreground">
                    <Music />
                    <span className="hidden lg:block">Music</span>
                  </div>
                }
              >
                <Card className="h-full w-full">
                  <CardBody>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                    irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur.
                  </CardBody>
                </Card>
              </Tab>
              <Tab
                key="videos"
                title={
                  <div className="flex items-center space-x-2 text-foreground">
                    <Video />
                    <span className="hidden lg:block">Video</span>
                  </div>
                }
              >
                <Card className="h-full w-full">
                  <CardBody>
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </CardBody>
                </Card>
              </Tab>
              <Tab
                key="Documents"
                title={
                  <div className="flex items-center space-x-2 text-foreground">
                    <FileText />
                    <span className="hidden lg:block">Documents</span>
                  </div>
                }
              >
                <Card className="h-full w-full">
                  <CardBody>
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </Tab>
        </Tabs>
      </section>
    </main>
  );
}
