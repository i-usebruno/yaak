import classNames from 'classnames';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

interface Props {
  children:
    | ReactElement<HTMLAttributes<HTMLTableColElement>>
    | ReactElement<HTMLAttributes<HTMLTableColElement>>[];
}

export function KeyValueRows({ children }: Props) {
  children = Array.isArray(children) ? children : [children];
  return (
    <table className="text-xs font-mono min-w-0 w-full mb-auto">
      <tbody className="divide-y divide-surface-highlight">
        {children.map((child, i) => (
          <tr key={i}>{child}</tr>
        ))}
      </tbody>
    </table>
  );
}

interface KeyValueRowProps {
  label: ReactNode;
  value: ReactNode;
  labelClassName?: string;
  labelColor?: 'secondary' | 'primary' | 'info';
}

export function KeyValueRow({
  label,
  value,
  labelColor = 'secondary',
  labelClassName,
}: KeyValueRowProps) {
  return (
    <>
      <td
        className={classNames(
          'select-none py-0.5 pr-2 h-full align-top max-w-[10rem]',
          labelClassName,
          labelColor === 'primary' && 'text-primary',
          labelColor === 'secondary' && 'text-text-subtle',
          labelColor === 'info' && 'text-info',
        )}
      >
        <span className="select-text cursor-text">{label}</span>
      </td>
      <td className="select-none py-0.5 break-all align-top max-w-[15rem]">
        <div className="select-text cursor-text max-h-[5rem] overflow-y-auto">{value}</div>
      </td>
    </>
  );
}
