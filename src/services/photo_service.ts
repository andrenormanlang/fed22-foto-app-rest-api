import { CreatePhotoData } from '../types'
import prisma from '../prisma'

export const createPhoto = async (data: CreatePhotoData) => {
    return await prisma.photo.create({ data })
}
