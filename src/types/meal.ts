export interface MealMacros {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface Meal {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  calories?: number;
  macros?: MealMacros;
  ingredients?: string[];
  category?: string;
  tags?: Array<{ label: string; variant: 'protein' | 'vegetarian' | 'vegan' | 'keto' | 'lowFat' | 'balanced' }>;
}
