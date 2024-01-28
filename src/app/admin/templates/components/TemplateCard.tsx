'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/core/ui/Dropdown';
import Button from '~/core/ui/Button';
import Tile from '~/core/ui/Tile';
import IconButton from '~/core/ui/IconButton';

import { ADMIN_NAVIGATION_CONFIG } from '~/app/admin/admin.config';

import type { ITemplate } from '~/lib/templates/types';

type TemplateCardProps = {
  data: ITemplate;
};

const TemplateCard = ({ data }: TemplateCardProps) => {
  const { id, title, image, category, description, isNew } = data;

  return (
    <Tile className="p-4 rounded-md hover:shadow-sm dark:shadow-gray-900 duration-75">
      <Tile.Header>
        <div className="flex justify-between w-full">
          <div className="space-y-2">
            <Image
              src={image}
              width={40}
              height={40}
              className="w-11 h-11 object-contain"
              alt={title}
            />
            <Tile.Heading className="text-base text-gray-800 dark:text-white ">
              {title}
            </Tile.Heading>
          </div>
          <div>{isNew && <Tile.Badge trend="up">New</Tile.Badge>}</div>
        </div>
      </Tile.Header>
      <Tile.Body className="h-full justify-between">
        <p className="text-sm text-gray-700 dark:text-gray-400">
          {description}
        </p>
        <div className="space-y-3">
          <div className="space-x-1">
            <Tile.Badge size="sm" trend="down">
              Best
            </Tile.Badge>
          </div>
          <div className="flex justify-between items-center">
            <Button
              href={`${ADMIN_NAVIGATION_CONFIG.templates.path}/${id}`}
              variant="secondary"
              size="small"
            >
              Edit
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton>
                  <span className="sr-only">Open menu</span>
                  <EllipsisHorizontalIcon className="h-6 w-6" />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link
                    className={
                      'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5'
                    }
                    href={`${ADMIN_NAVIGATION_CONFIG.templates.path}/${data.id}/delete`}
                  >
                    Delete Template
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Tile.Body>
    </Tile>
  );
};

export default TemplateCard;
