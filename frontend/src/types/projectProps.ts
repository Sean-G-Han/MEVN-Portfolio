export type ProjectProps = {
    title: string
    type: string
    description: string
    techStack: Array<string>
    link?: string
    date?: string
}

export const projectDefaults = {
    title: 'No Title',
    description: 'No Description',
    techStack: () => Array<string>(),
    link: undefined,
    date: undefined
}