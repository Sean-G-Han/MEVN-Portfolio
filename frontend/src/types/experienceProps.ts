export type ExperienceProps = {
    company: string
    role: string
    type: string
    from?: string
    to?: string
    description: string
}

export const experienceDefaults = {
    company: 'No Company', 
    role: 'No Role',
    description: 'No Description',
    from: undefined,
    to: undefined
}