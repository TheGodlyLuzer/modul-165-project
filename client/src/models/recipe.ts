export interface Recipe {
    _id: string;
    title: string;
    description: string;
    image: string;
    ingredients: {name: string, amount: number, unit: string}[];
    instructions: {description: string, time: number;}[];
    createdAt: Date;
}