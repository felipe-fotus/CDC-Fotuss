import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';

// Table Root
export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export const Table = ({ children, style, ...props }: TableProps) => {
  const tableStyles: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 'var(--text-sm)',
    ...style,
  };

  return (
    <table style={tableStyles} {...props}>
      {children}
    </table>
  );
};

// Table Header
export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableHeader = ({ children, style, ...props }: TableHeaderProps) => {
  const headerStyles: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    backgroundColor: 'var(--color-surface)',
    zIndex: 10,
    ...style,
  };

  return (
    <thead style={headerStyles} {...props}>
      {children}
    </thead>
  );
};

// Table Body
export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableBody = ({ children, ...props }: TableBodyProps) => {
  return <tbody {...props}>{children}</tbody>;
};

// Table Row
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  clickable?: boolean;
  zebra?: boolean;
  index?: number;
  selected?: boolean;
}

export const TableRow = ({
  children,
  clickable,
  zebra,
  index = 0,
  selected,
  style,
  ...props
}: TableRowProps) => {
  const getBackgroundColor = () => {
    if (selected) return 'var(--color-primary-subtle)';
    if (zebra && index % 2 === 1) return 'var(--color-border-subtle)';
    return 'transparent';
  };

  const rowStyles: React.CSSProperties = {
    borderBottom: '1px solid var(--color-border-subtle)',
    transition: 'background-color 150ms ease',
    cursor: clickable ? 'pointer' : 'default',
    backgroundColor: getBackgroundColor(),
    ...style,
  };

  return (
    <tr style={rowStyles} {...props}>
      {children}
    </tr>
  );
};

// Table Head Cell
export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
}

export const TableHead = ({
  children,
  sortable,
  sortDirection,
  style,
  ...props
}: TableHeadProps) => {
  const headStyles: React.CSSProperties = {
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    borderBottom: '2px solid var(--color-border)',
    whiteSpace: 'nowrap',
    cursor: sortable ? 'pointer' : 'default',
    userSelect: sortable ? 'none' : 'auto',
    ...style,
  };

  const SortIcon = () => {
    if (!sortable) return null;

    return (
      <span style={{ marginLeft: '0.25rem', opacity: sortDirection ? 1 : 0.3 }}>
        {sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : '↕'}
      </span>
    );
  };

  return (
    <th style={headStyles} {...props}>
      {children}
      <SortIcon />
    </th>
  );
};

// Table Cell
export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  truncate?: boolean;
}

export const TableCell = ({ children, truncate, style, ...props }: TableCellProps) => {
  const cellStyles: React.CSSProperties = {
    padding: '0.75rem 1rem',
    color: 'var(--color-text-primary)',
    ...(truncate && {
      maxWidth: '200px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
    ...style,
  };

  return (
    <td style={cellStyles} {...props}>
      {children}
    </td>
  );
};

Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableHead.displayName = 'TableHead';
TableCell.displayName = 'TableCell';
