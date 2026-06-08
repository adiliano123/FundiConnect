import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: string) => format(new Date(date), 'dd MMM yyyy');
export const formatDateTime = (date: string) => format(new Date(date), 'dd MMM yyyy, HH:mm');
export const timeAgo = (date: string) => formatDistanceToNow(new Date(date), { addSuffix: true });
export const formatCurrency = (amount: number, currency = 'TZS') =>
  new Intl.NumberFormat('sw-TZ', { style: 'currency', currency }).format(amount);

export const statusColors: Record<string, string> = {
  pending:           'bg-yellow-100 text-yellow-800',
  accepted:          'bg-blue-100 text-blue-800',
  awaiting_payment:  'bg-orange-100 text-orange-700',
  paid:              'bg-teal-100 text-teal-700',
  in_progress:       'bg-purple-100 text-purple-800',
  completed:         'bg-green-100 text-green-800',
  cancelled:         'bg-red-100 text-red-800',
  rejected:          'bg-red-100 text-red-800',
};

export const statusLabels: Record<string, string> = {
  pending:           'Pending',
  accepted:          'Accepted',
  awaiting_payment:  'Awaiting Payment',
  paid:              'Paid',
  in_progress:       'In Progress',
  completed:         'Completed',
  cancelled:         'Cancelled',
  rejected:          'Rejected',
};
