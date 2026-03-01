import { Skeleton } from '@/components/ui/skeleton';
import { Users, Shield, User } from 'lucide-react';
import type { Member } from '@/components/dashboard/types';

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
    <div className="bg-white/70 dark:bg-[#0A0A0A]/70 backdrop-blur-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Header with accent bar */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#C9A86C]/30 to-transparent" />
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="w-10 h-10 bg-linear-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
            <Users size={18} strokeWidth={1.5} className="text-gray-400" />
          </div>
          <div>
            <h2 className="text-sm font-medium tracking-widest uppercase text-gray-900 dark:text-white">
              Client Directory
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {filteredMembers.length} registered collector{filteredMembers.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-gray-800/50">
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
                Role
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-6 py-4 flex justify-end"><Skeleton className="h-6 w-16" /></td>
                </tr>
              ))
            ) : filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Users size={20} className="text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-500">No clients found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredMembers.map((member, index) => (
                <tr
                  key={member._id}
                  className="group hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-linear-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:from-[#C9A86C]/10 group-hover:to-[#C9A86C]/5 transition-all">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white font-medium">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{member.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 tabular-nums font-light">{member.YOB}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {member.gender ? 'Male' : 'Female'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {member.isAdmin ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#C9A86C]/10 text-[#C9A86C]">
                        <Shield size={10} strokeWidth={2} />
                        <span className="text-[9px] tracking-widest uppercase font-medium">Admin</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                        <User size={10} strokeWidth={2} />
                        <span className="text-[9px] tracking-widest uppercase font-medium">Client</span>
                      </span>
                    )}
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
