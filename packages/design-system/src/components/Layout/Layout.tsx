import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

// Container
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth = 'xl', padding = true, children, style, ...props }, ref) => {
    const maxWidthMap = {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      full: '100%',
    };

    const containerStyles: React.CSSProperties = {
      width: '100%',
      maxWidth: maxWidthMap[maxWidth],
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: padding ? 'var(--spacing-4)' : 0,
      paddingRight: padding ? 'var(--spacing-4)' : 0,
      ...style,
    };

    return (
      <div ref={ref} style={containerStyles} {...props}>
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

// Stack
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = 'column',
      gap = 'md',
      align = 'stretch',
      justify = 'start',
      wrap = false,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const gapMap = {
      none: '0',
      xs: 'var(--spacing-1)',
      sm: 'var(--spacing-2)',
      md: 'var(--spacing-4)',
      lg: 'var(--spacing-6)',
      xl: 'var(--spacing-8)',
    };

    const alignMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch',
    };

    const justifyMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      between: 'space-between',
      around: 'space-around',
    };

    const stackStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: direction,
      gap: gapMap[gap],
      alignItems: alignMap[align],
      justifyContent: justifyMap[justify],
      flexWrap: wrap ? 'wrap' : 'nowrap',
      ...style,
    };

    return (
      <div ref={ref} style={stackStyles} {...props}>
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';

// HStack (Horizontal Stack shorthand)
export interface HStackProps extends Omit<StackProps, 'direction'> {}

export const HStack = forwardRef<HTMLDivElement, HStackProps>((props, ref) => (
  <Stack ref={ref} direction="row" {...props} />
));

HStack.displayName = 'HStack';

// VStack (Vertical Stack shorthand)
export interface VStackProps extends Omit<StackProps, 'direction'> {}

export const VStack = forwardRef<HTMLDivElement, VStackProps>((props, ref) => (
  <Stack ref={ref} direction="column" {...props} />
));

VStack.displayName = 'VStack';

// Grid
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    { cols = 1, gap = 'md', alignItems = 'stretch', children, style, ...props },
    ref
  ) => {
    const gapMap = {
      none: '0',
      xs: 'var(--spacing-1)',
      sm: 'var(--spacing-2)',
      md: 'var(--spacing-4)',
      lg: 'var(--spacing-6)',
      xl: 'var(--spacing-8)',
    };

    const alignMap = {
      start: 'start',
      center: 'center',
      end: 'end',
      stretch: 'stretch',
    };

    const gridStyles: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap: gapMap[gap],
      alignItems: alignMap[alignItems],
      ...style,
    };

    return (
      <div ref={ref} style={gridStyles} {...props}>
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

// Divider
export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ orientation = 'horizontal', style, ...props }, ref) => {
    const dividerStyles: React.CSSProperties = {
      border: 'none',
      margin: 0,
      ...(orientation === 'horizontal'
        ? {
            width: '100%',
            height: '1px',
            backgroundColor: 'var(--color-border-subtle)',
          }
        : {
            width: '1px',
            height: '100%',
            backgroundColor: 'var(--color-border-subtle)',
          }),
      ...style,
    };

    return <hr ref={ref} style={dividerStyles} {...props} />;
  }
);

Divider.displayName = 'Divider';

// Spacer
export interface SpacerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  ({ size, style, ...props }, ref) => {
    const sizeMap = {
      xs: 'var(--spacing-2)',
      sm: 'var(--spacing-4)',
      md: 'var(--spacing-6)',
      lg: 'var(--spacing-8)',
      xl: 'var(--spacing-12)',
    };

    const spacerStyles: React.CSSProperties = {
      flex: size ? `0 0 ${sizeMap[size]}` : '1 1 auto',
      ...style,
    };

    return <div ref={ref} style={spacerStyles} {...props} />;
  }
);

Spacer.displayName = 'Spacer';
