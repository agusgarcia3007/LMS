type MockData = {
  users: any[];
  tenants: any[];
  refreshTokens: any[];
  instructorProfiles: any[];
};

export function createMockDb(data: MockData) {
  return {
    select: (fields?: any) => ({
      from: (table: any) => ({
        where: (condition: any) => ({
          limit: (n: number) => {
            const tableName = getTableName(table);
            const items = data[tableName as keyof MockData] || [];
            return Promise.resolve(items.slice(0, n));
          },
        }),
      }),
    }),
    insert: (table: any) => ({
      values: (values: any) => ({
        returning: () => {
          const tableName = getTableName(table);
          const newItem = { id: `mock-${Date.now()}`, ...values };
          if (data[tableName as keyof MockData]) {
            data[tableName as keyof MockData].push(newItem);
          }
          return Promise.resolve([newItem]);
        },
      }),
    }),
    update: (table: any) => ({
      set: (values: any) => ({
        where: (condition: any) => ({
          returning: () => {
            const tableName = getTableName(table);
            const items = data[tableName as keyof MockData] || [];
            if (items.length > 0) {
              Object.assign(items[0], values);
              return Promise.resolve([items[0]]);
            }
            return Promise.resolve([]);
          },
        }),
      }),
    }),
    delete: (table: any) => ({
      where: (condition: any) => {
        return Promise.resolve();
      },
    }),
  };
}

function getTableName(table: any): string {
  if (table?.name) return table.name;
  if (typeof table === "string") return table;
  return "unknown";
}

export function createEmptyMockData(): MockData {
  return {
    users: [],
    tenants: [],
    refreshTokens: [],
    instructorProfiles: [],
  };
}
