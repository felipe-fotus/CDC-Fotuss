import type { HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
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

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
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

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableBody = ({ children, ...props }: TableBodyProps) => {
  return <tbody {...props}>{children}</tbody>;
};

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  clickable?: boolean;
  zebra?: boolean;
  index?: number;
}

export const TableRow = ({ children, clickable, zebra, index = 0, style, ...props }: TableRowProps) => {
  const rowStyles: React.CSSProperties = {
    borderBottom: '1px solid var(--color-border-subtle)',
    transition: 'background-color 150ms ease',
    cursor: clickable ? 'pointer' : 'default',
    backgroundColor: zebra && index % 2 === 1 ? 'var(--color-border-subtle)' : 'transparent',
    ...style,
  };

  return (
    <tr style={rowStyles} {...props}>
      {children}
    </tr>
  );
};

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export const TableHead = ({ children, style, ...props }: TableHeadProps) => {
  const headStyles: React.CSSProperties = {
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    borderBottom: '2px solid var(--color-border)',
    whiteSpace: 'nowrap',
    ...style,
  };

  return (
    <th style={headStyles} {...props}>
      {children}
    </th>
  );
};

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export const TableCell = ({ children, style, ...props }: TableCellProps) => {
  const cellStyles: React.CSSProperties = {
    padding: '0.75rem 1rem',
    color: 'var(--color-text-primary)',
    ...style,
  };

  return (
    <td style={cellStyles} {...props}>
      {children}
    </td>
  );
};
