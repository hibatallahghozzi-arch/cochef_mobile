import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();


// ----------------------
// Create Users
// ----------------------

async function upsertUser(
  email: string,
  fullName: string,
  role: Role,
) {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  return prisma.user.upsert({
    where: { email },

    update: {},

    create: {
      email,
      fullName,
      role,
      passwordHash,

      wallet: {
        create: {
          nfcBalance: role === Role.VILLAGER ? 20 : 0,
        },
      },
    },
  });
}


// ----------------------
// Create Meals
// ----------------------

async function createMeals() {
  const meals = [
    {
      name: 'Couscous Tunisien',
      description: 'Traditional Tunisian couscous with vegetables and meat',

      price: 8,
      calories: 650,
      proteinsG: 30,
      lipidsG: 20,
      fibersG: 12,

      allergens: [],
      ingredients: ['Semolina', 'Vegetables', 'Meat'],
      isActive: true,
    },

    {
      name: 'Chicken Pasta',
      description: 'Pasta with grilled chicken',

      price: 10,
      calories: 700,
      proteinsG: 35,
      lipidsG: 18,
      fibersG: 8,

      allergens: [],
      ingredients: ['Pasta', 'Chicken'],
      isActive: true,
    },

    {
      name: 'Vegetable Salad',
      description: 'Fresh healthy vegetable salad',

      price: 5,
      calories: 250,
      proteinsG: 10,
      lipidsG: 5,
      fibersG: 15,

      allergens: [],
      ingredients: ['Lettuce', 'Tomato', 'Cucumber'],
      isActive: true,
    },
  ];

  for (const meal of meals) {
    await prisma.meal.upsert({
      where: {
        name: meal.name,
      },
      update: {},
      create: meal,
    });
  }
}

// ----------------------
// Create Favorites
// ----------------------

async function createFavorites() {

  const villager =
    await prisma.user.findUnique({
      where: {
        email: 'villager@cochef.test',
      },
    });


  const meal =
    await prisma.meal.findFirst({
      where: {
        name: 'Couscous Tunisien',
      },
    });


  if (!villager || !meal) {
    return;
  }


  await prisma.favorite.upsert({

    where: {
      userId_mealId: {
        userId: villager.id,
        mealId: meal.id,
      },
    },

    update: {},

    create: {
      userId: villager.id,
      mealId: meal.id,
    },

  });

}


// ----------------------
// Main Seed Function
// ----------------------

async function main() {


  // Users

  await upsertUser(
    'villager@cochef.test',
    'Villager Test',
    Role.VILLAGER,
  );


  await upsertUser(
    'manager@cochef.test',
    'Manager Test',
    Role.MANAGER,
  );


  await upsertUser(
    'admin@cochef.test',
    'Admin Test',
    Role.ADMIN,
  );


  // Meals

  await createMeals();


  // Favorites

  await createFavorites();



  // Display database state

  const users =
    await prisma.user.findMany({
      select:{
        email:true,
        role:true,
      },
    });


  const meals =
    await prisma.meal.findMany({
      select:{
        name:true,
        price:true,
      },
    });


  console.log('Users currently in database:');
  console.table(users);


  console.log('Meals currently in database:');
  console.table(meals);

}


// ----------------------
// Execute
// ----------------------

main()

.catch((error)=>{

  console.error(error);

  process.exit(1);

})

.finally(async()=>{

  await prisma.$disconnect();

});