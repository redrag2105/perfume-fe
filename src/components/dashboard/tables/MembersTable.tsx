import { Skeleton } from '@/components/ui/skeleton';
import type { Member } from '../types';

interface MembersTableProps {
  members: Member[];
  searchQuery: string;
  isLoading?: boolean;
}

export default function MembersTable({ members, searchQuery, isLoading = false }: MembersTableProps) {
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-sm font-medium tracking-widest uppercase text-gray-900 dark:text-white">
          Client Directory
        </h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          View-only access to registered collectors
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              <th className="px-6 py-4 text-left text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 font-medium">
                Name
              </th>
              <th className="px-6 py-4 text-left text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 font-medium">
                Email
              </th>
              <th className="px-6 py-4 text-left text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 font-medium">
                Birth Year
              </th>
              <th className="px-6 py-4 text-left text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 font-medium">
                Gender
              </th>
              <th className="px-6 py-4 text-right text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-gray-800">
                  <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-6 py-4 flex justify-end"><Skeleton className="h-4 w-12" /></td>
                </tr>
              ))
            ) : filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className="text-sm text-gray-400 dark:text-gray-500 italic">No clients found</p>
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                <tr
                  key={member._id}
                  className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{member.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{member.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 tabular-nums">{member.YOB}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {member.gender ? 'Male' : 'Female'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-[9px] tracking-[0.15em] uppercase font-medium ${
                        member.isAdmin ? 'text-[#D4AF37]' : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {member.isAdmin ? 'Admin' : 'Client'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
