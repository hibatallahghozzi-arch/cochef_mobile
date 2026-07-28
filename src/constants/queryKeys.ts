export const queryKeys = {
  meals: {
    all: ['meals'] as const,
    detail: (id: string) => ['meals', id] as const,
  },
  orders: {
    all: ['orders'] as const,
    detail: (id: string) => ['orders', id] as const,
  },
  favorites: {
    all: ['favorites'] as const,
  },
};
