const width = 1920;
const height = 1080;

export type PathData = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x3: number;
    y3: number;
    x4: number;
    y4: number;
};

export type RoadData = PathData[];

export type SpotData = {
    x: number;
    y: number;
};

export type EnemiesData = {
    cooldown: number;
    number: number;
    health: number;
    speed: number;
    gold: number;
};

export type WaveData = {
    timing: number;
    enemies: EnemiesData;
};

export type LevelData = {
    level: number;
    startingGoldAmount: number;
    image: string;
    nbTurtles: number;
    roads: RoadData[];
    spots: SpotData[];
    waves: WaveData[];
};

export const levelsJSON: LevelData[] = [
    {
        level: 1,
        startingGoldAmount: 50,
        image: "background-1.png",
        nbTurtles: 5,
        roads: [
            [
                {
                    x1: width,
                    y1: height / 6,
                    x2: (width * 5) / 6,
                    y2: (height * 2) / 6,
                    x3: (width * 2) / 3,
                    y3: (height * 2) / 6,
                    x4: width / 2,
                    y4: height / 2,
                },
                {
                    x1: width / 2,
                    y1: height / 2,
                    x2: width / 3,
                    y2: (height * 4) / 6,
                    x3: width / 6,
                    y3: (height * 4) / 6,
                    x4: 40,
                    y4: height / 2,
                },
            ],
        ],
        spots: [
            { x: width / 2, y: height / 1.6 },
            { x: width / 5, y: height / 2 },
            { x: width / 1.65, y: height / 1.9 },
            { x: width / 1.2, y: height / 6 },
            { x: width / 7, y: height / 1.4 },
        ],
        waves: [
            {
                timing: 5,
                enemies: {
                    cooldown: 0.3,
                    number: 8,
                    health: 10,
                    speed: 0.15,
                    gold: 5,
                },
            },
            {
                timing: 20,
                enemies: {
                    cooldown: 0.2,
                    number: 10,
                    health: 10,
                    speed: 0.15,
                    gold: 5,
                },
            },
            {
                timing: 40,
                enemies: {
                    cooldown: 0.3,
                    number: 15,
                    health: 10,
                    speed: 0.15,
                    gold: 5,
                },
            },
            {
                timing: 59,
                enemies: {
                    cooldown: 0.2,
                    number: 1,
                    health: 100,
                    speed: 0.08,
                    gold: 50,
                },
            },
            {
                timing: 60,
                enemies: {
                    cooldown: 0.2,
                    number: 25,
                    health: 10,
                    speed: 0.15,
                    gold: 5,
                },
            },
            {
                timing: 80,
                enemies: {
                    cooldown: 0.1,
                    number: 40,
                    health: 10,
                    speed: 0.15,
                    gold: 5,
                },
            },
            {
                timing: 100,
                enemies: {
                    cooldown: 0.3,
                    number: 25,
                    health: 10,
                    speed: 0.25,
                    gold: 10,
                },
            },
        ],
    },
    {
        level: 2,
        startingGoldAmount: 100,
        image: "background-2.png",
        nbTurtles: 3,
        roads: [
            [
                {
                    x1: 0,
                    y1: height / 3,
                    x2: width / 4,
                    y2: height,
                    x3: width / 4,
                    y3: 0,
                    x4: width / 2,
                    y4: height / 8,
                },
                {
                    x1: width / 2,
                    y1: height / 8,
                    x2: width / 2 + width / 2,
                    y2: height / 1.5,
                    x3: width / 2,
                    y3: height,
                    x4: width / 2,
                    y4: height - height / 4,
                },
            ],
        ],
        spots: [
            { x: width / 6.8, y: height / 2.3 },
            { x: width / 3.5, y: height / 6.5 },
            { x: width / 2.2, y: height / 4 },
            { x: width / 1.6, y: height / 1.5 },
            { x: width / 2.3, y: height / 1.2 },
        ],
        waves: [
            {
                timing: 5,
                enemies: {
                    cooldown: 0.3,
                    number: 8,
                    health: 10,
                    speed: 0.15,
                    gold: 5,
                },
            },
            {
                timing: 20,
                enemies: {
                    cooldown: 0.3,
                    number: 10,
                    health: 20,
                    speed: 0.1,
                    gold: 8,
                },
            },
            {
                timing: 35,
                enemies: {
                    cooldown: 0.18,
                    number: 15,
                    health: 20,
                    speed: 0.1,
                    gold: 8,
                },
            },
            {
                timing: 40,
                enemies: {
                    cooldown: 0.3,
                    number: 15,
                    health: 10,
                    speed: 0.15,
                    gold: 5,
                },
            },
            {
                timing: 60,
                enemies: {
                    cooldown: 0.35,
                    number: 30,
                    health: 20,
                    speed: 0.1,
                    gold: 8,
                },
            },
            {
                timing: 80,
                enemies: {
                    cooldown: 0.1,
                    number: 30,
                    health: 10,
                    speed: 0.25,
                    gold: 10,
                },
            },
            {
                timing: 80,
                enemies: {
                    cooldown: 0.1,
                    number: 2,
                    health: 100,
                    speed: 0.08,
                    gold: 50,
                },
            },
        ],
    },
];
