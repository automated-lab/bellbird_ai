import React, { useMemo } from 'react';

import Heading from '~/core/ui/Heading';
import { cn } from '~/core/generic/shadcn-utils';

import {
  ArrowSmallDownIcon,
  ArrowSmallUpIcon,
  Bars2Icon,
} from '@heroicons/react/24/outline';
import { cva } from 'cva';

const Tile: React.FCC<React.PropsWithChildren<{ className?: string }>> & {
  Header: typeof TileHeader;
  Heading: typeof TileHeading;
  Body: typeof TileBody;
  Figure: typeof TileFigure;
  Trend: typeof TileTrend;
  Badge: typeof TileBadge;
} = ({ children, className }) => {
  return (
    <div
      className={cn(
        'flex flex-col space-y-3 rounded-2xl border bg-background p-5',
        className as string,
      )}
    >
      {children}
    </div>
  );
};

function TileHeader(props: React.PropsWithChildren) {
  return <div className={'flex'}>{props.children}</div>;
}

function TileHeading(props: React.PropsWithChildren<{ className?: string }>) {
  return (
    <Heading type={5}>
      <span
        className={cn(
          'font-medium text-gray-600 dark:text-gray-400',
          props.className,
        )}
      >
        {props.children}
      </span>
    </Heading>
  );
}

function TileBody({
  children,
  space = '5',
  className,
}: {
  children: React.ReactNode;
  space?: '2' | '3' | '4' | '5';
  className?: string;
}) {
  const spacing = {
    2: 'space-y-2',
    3: 'space-y-3',
    4: 'space-y-4',
    5: 'space-y-5',
  };

  return (
    <div className={cn('flex flex-col', spacing[space], className)}>
      {children}
    </div>
  );
}

function TileFigure(props: React.PropsWithChildren) {
  return <div className={'text-3xl font-bold'}>{props.children}</div>;
}

function TileTrend(
  props: React.PropsWithChildren<{
    trend: 'up' | 'down' | 'stale';
  }>,
) {
  const Icon = useMemo(() => {
    switch (props.trend) {
      case 'up':
        return <ArrowSmallUpIcon className={'h-4 text-green-500'} />;
      case 'down':
        return <ArrowSmallDownIcon className={'h-4 text-red-500'} />;
      case 'stale':
        return <Bars2Icon className={'h-4 text-yellow-500'} />;
    }
  }, [props.trend]);

  return (
    <TileBadge trend={props.trend}>
      <span className={'flex items-center space-x-1'}>
        {Icon}
        <span>{props.children}</span>
      </span>
    </TileBadge>
  );
}

function TileBadge({
  trend,
  children,
  size = 'lg',
}: React.PropsWithChildren<{
  trend: 'up' | 'down' | 'stale';
  size?: 'sm' | 'lg';
}>) {
  const badgeVariants = cva(
    'inline-flex items-center rounded-3xl text-sm font-semibold justify-center',
    {
      variants: {
        size: {
          sm: `py-1 px-2 text-xs`,
          lg: `py-1 px-2.5 text-lg`,
        },
      },
    },
  );

  const className = badgeVariants({
    size: size,
  });

  if (trend === `up`) {
    return (
      <div
        className={`${className} bg-green-50 text-green-600 dark:bg-green-500/10`}
      >
        <span>{children}</span>
      </div>
    );
  }

  if (trend === `down`) {
    return (
      <div className={`${className} bg-red-50 text-red-600 dark:bg-red-500/10`}>
        <span>{children}</span>
      </div>
    );
  }

  return (
    <div
      className={`${className} bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10`}
    >
      <span>{children}</span>
    </div>
  );
}

Tile.Header = TileHeader;
Tile.Heading = TileHeading;
Tile.Body = TileBody;
Tile.Figure = TileFigure;
Tile.Trend = TileTrend;
Tile.Badge = TileBadge;

export default Tile;
