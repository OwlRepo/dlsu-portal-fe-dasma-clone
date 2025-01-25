export const headers = [
  { header: 'Status', accessor: 'AT' as const }, // Use 'as const' to infer the literal type
  { header: 'ID', accessor: 'ID' as const },
  { header: 'Name', accessor: 'NAME' as const },
  { header: 'Type', accessor: 'TYPE' as const },
  { header: 'Gate', accessor: 'GATE' as const },
  { header: 'Activity', accessor: 'ACTIVITY' as const },
];

export const usersHeaders = [
  { header: 'ID', accessor: 'ID' as const },
  { header: 'Username', accessor: 'USERNAME' as const },
  { header: 'First Name', accessor: 'FIRST_NAME' as const },
  { header: 'Last Name', accessor: 'LAST_NAME' as const },
  { header: 'Role', accessor: 'ROLE' as const },
  { header: 'Date Added', accessor: 'DATE_ADDED' as const },
];
