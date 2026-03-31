export interface Recipe {
  id: string
  name: string
  image_url?: string
  ingredients: string
  instruction: string
  tags: string[]
  extension?: string // needed to delete the image from the storage
  user_id: string
}

export enum ContentType {
  INSTRUCTION = 'instruction',
  INGREDIENTS = 'ingredients',
  TAGS = 'tags',
  NAME = 'name',
}