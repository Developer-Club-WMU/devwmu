import { assertOfficerFn } from '@/server/helpers/route-protection'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import {
  Users,
  Search,
  MoreVertical,
  ShieldCheck,
  UserX,
  UserCheck,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { format } from 'date-fns'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export const Route = createFileRoute('/app/members/')({
  component: MembersPage,
  beforeLoad: () => assertOfficerFn(),
})

type User = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string | null
  createdAt: Date
  updatedAt: Date
  role?: string | null
  banned?: boolean | null
  banReason?: string | null
  banExpires?: Date | null
}

const columnHelper = createColumnHelper<User>()

function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm, page],
    queryFn: async () => {
      const response = await authClient.admin.listUsers({
        query: {
          searchValue: searchTerm,
          searchField: 'name',
          searchOperator: 'contains',
          limit: pageSize,
          offset: page * pageSize,
          sortBy: 'createdAt',
          sortDirection: 'desc',
        },
      })
      if (response.error) throw response.error
      return response.data
    },
  })

  const users = data?.users || []

  const columns = [
    columnHelper.accessor('name', {
      header: 'Member',
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">
            {info.getValue()?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight">
              {info.getValue()}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="w-3 h-3" /> {info.row.original.email}
            </span>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('role', {
      header: 'Role',
      cell: (info) => (
        <Badge
          variant={info.getValue() === 'admin' ? 'default' : 'secondary'}
          className="uppercase text-[10px] font-black tracking-widest px-2 py-0"
        >
          {info.getValue() || 'user'}
        </Badge>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Joined',
      cell: (info) => (
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {format(new Date(info.getValue()), 'MMM dd, yyyy')}
        </div>
      ),
    }),
    columnHelper.accessor('banned', {
      header: 'Status',
      cell: (info) => (
        <div className="flex items-center">
          {info.getValue() ? (
            <Badge
              variant="destructive"
              className="flex items-center gap-1 text-[10px] font-bold"
            >
              <UserX className="w-3 h-3" /> BANNED
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="flex items-center gap-1 text-[10px] font-bold text-green-500 border-green-500/20 bg-green-500/5"
            >
              <UserCheck className="w-3 h-3" /> ACTIVE
            </Badge>
          )}
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: () => (
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </Button>
      ),
    }),
  ]

  const table = useReactTable({
    data: users as User[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="container py-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Administration
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            Member Directory
          </h1>
          <p className="text-muted-foreground font-medium">
            Manage and view all registered club members.
          </p>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by name..."
            className="pl-10 h-11 bg-background/50 border-muted group-hover:border-primary/50 focus-visible:ring-primary/20 transition-all rounded-xl shadow-sm"
            value={searchTerm}
            onChange={(e) => {
              console.log(e.target.value)
              setSearchTerm(e.target.value)
              setPage(0)
            }}
          />
        </div>
      </div>

      <Card className="border-muted/50 shadow-xl shadow-primary/5 bg-background/30 backdrop-blur-xl overflow-hidden rounded-2xl">
        <CardHeader className="p-6 border-b border-muted/50 bg-muted/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Total Members</CardTitle>
              <CardDescription className="italic font-medium">
                Viewing {users.length} registered users
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent border-muted/50"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-4 h-auto"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-64 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground animate-pulse">
                        <Users className="w-10 h-10 opacity-20" />
                        <span className="font-bold uppercase text-xs tracking-widest">
                          Fetching Members...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-64 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <UserX className="w-10 h-10 opacity-20" />
                        <span className="font-bold uppercase text-xs tracking-widest">
                          No members found
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-muted/50 hover:bg-muted/10 transition-colors group"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Pagination bar */}
        <div className="p-4 border-t border-muted/50 bg-muted/5 flex items-center justify-between gap-4">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Page {page + 1}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="h-9 gap-1 font-bold rounded-lg border-muted/50"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={users.length < pageSize}
              onClick={() => setPage((p) => p + 1)}
              className="h-9 gap-1 font-bold rounded-lg border-muted/50"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
