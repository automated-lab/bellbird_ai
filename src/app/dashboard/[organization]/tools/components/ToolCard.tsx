'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

import Button from '~/core/ui/Button';
import Tile from '~/core/ui/Tile';
import { Avatar, AvatarImage } from '~/core/ui/Avatar';

import type { ITemplate } from '~/lib/templates/types';
import { getPath } from '~/navigation.config';
import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';

interface ToolCardProps {
  data: ITemplate;
}

const ToolCard = ({ data }: ToolCardProps) => {
  const { id, title, category, image, description, isNew } = data;

  const organization = useCurrentOrganization();

  if (!organization) {
    return null;
  }

  return (
    <Link href={getPath(organization.uuid, `tools/${id}`)}>
      <Tile className="h-full p-4 duration-75 rounded-md cursor-pointer group hover:border-primary-600/50 hover:shadow-sm dark:shadow-gray-900">
        <Tile.Header>
          <div className="flex justify-between w-full">
            <div className="space-y-2">
              <Avatar className="bg-blue-200 rounded-sm">
                <AvatarImage
                  src={image}
                  width={40}
                  height={40}
                  className="object-contain w-11 h-11 bg-blue-50"
                />
              </Avatar>
              <div>
                <Tile.Heading className="text-base text-gray-800 dark:text-white ">
                  {title}
                </Tile.Heading>
                <p className="text-xs text-gray-400 capitalize dark:text-gray-600">
                  {category}
                </p>
              </div>
            </div>
            <div>
              <div>{isNew && <Tile.Badge trend="up">New</Tile.Badge>}</div>
            </div>
          </div>
        </Tile.Header>
        <Tile.Body space="2" className="justify-between h-full">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {description}
          </p>
          <div className="space-y-1">
            <div className="space-x-1">
              <Tile.Badge size="sm" trend="stale">
                Best
              </Tile.Badge>
            </div>
            <div className="flex items-center justify-end">
              <Button
                className="text-gray-300 transition-all duration-100 ease-out group-hover:rotate-45 group-hover:text-primary-600 group-hover:translate-x-1"
                size="small"
                variant="ghost"
                round
              >
                <ArrowUpRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Tile.Body>
      </Tile>
    </Link>
  );
};

export default ToolCard;
