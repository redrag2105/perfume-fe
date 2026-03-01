import { useMemo } from 'react';
import { 
  DataTable, 
  TableRow, 
  TableCell, 
  TableHeader,
} from './DataTable';
import { SortableHeader } from './SortableHeader';
import { useSortState } from '@/hooks/useSortState';
import type { Member } from '@/components/dashboard/types';

type SortField = 'name' | 'email' | 'YOB' | 'gender';

interface MembersTableProps {
  members: Member[];
  searchQuery: string;
  isLoading?: boolean;
}

export default function MembersTable({ members, searchQuery, isLoading = false }: MembersTableProps) {
  const { sortBy, sortOrder, handleSortChange } = useSortState<SortField>('name');

  const sortedMembers = useMemo(() => {
    const filtered = members.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'YOB':
          comparison = a.YOB - b.YOB;
          break;
        case 'gender':
          comparison = (a.gender ? 1 : 0) - (b.gender ? 1 : 0);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [members, searchQuery, sortBy, sortOrder]);

  return (
    <DataTable
      title="Client Directory"
      subtitle="View-only access to registered collectors"
      columns={5}
      isLoading={isLoading}
      isEmpty={sortedMembers.length === 0}
      emptyMessage="No clients found"
      skeletonWidths={['w-32', 'w-48', 'w-16', 'w-16', 'w-12']}
      headerContent={
        <>
          <SortableHeader label="Name" field="name" currentSort={sortBy} currentOrder={sortOrder} onSort={handleSortChange} />
          <SortableHeader label="Email" field="email" currentSort={sortBy} currentOrder={sortOrder} onSort={handleSortChange} />
          <SortableHeader label="Birth Year" field="YOB" currentSort={sortBy} currentOrder={sortOrder} onSort={handleSortChange} />
          <SortableHeader label="Gender" field="gender" currentSort={sortBy} currentOrder={sortOrder} onSort={handleSortChange} />
          <TableHeader align="right">Status</TableHeader>
        </>
      }
    >
      {sortedMembers.map((member) => (
        <TableRow key={member._id}>
          <TableCell className="text-sm text-gray-900 dark:text-white">{member.name}</TableCell>
          <TableCell className="text-sm text-gray-500 dark:text-gray-300">{member.email}</TableCell>
          <TableCell className="text-sm text-gray-500 dark:text-gray-300 tabular-nums">{member.YOB}</TableCell>
          <TableCell className="text-sm text-gray-500 dark:text-gray-300 capitalize">
            {member.gender ? 'Male' : 'Female'}
          </TableCell>
          <TableCell className="text-right">
            <span
              className={`text-[9px] tracking-[0.15em] uppercase font-medium ${
                member.isAdmin ? 'text-[#D4AF37] dark:text-[#FFD700]' : 'text-gray-400 dark:text-gray-400'
              }`}
            >
              {member.isAdmin ? 'Admin' : 'Client'}
            </span>
          </TableCell>
        </TableRow>
      ))}
    </DataTable>
  );
}
