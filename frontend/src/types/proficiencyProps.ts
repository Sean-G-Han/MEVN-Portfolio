export type ProficiencyType = 'Software Development' | 'Database' | 'Game Development' | 'Others' | 'Frontend' | 'Backend';

export type ProficiencyProps = {
    language: string
    level: number
    type: ProficiencyType
}

export const projectDefaults = {
    title: 'No Title',
    description: 'No Description',
    techStack: () => Array<string>(),
    link: undefined,
    date: undefined
}