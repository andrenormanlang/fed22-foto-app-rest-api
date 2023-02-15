/**
 * Type Definitions
 */

export type CreateUserData = {
	email: string,
	password: string,
    first_name: string,
    last_name: string,
}

export type UpdateUserData = {
	first_name?: string,
	last_name?: string,
	email?: string,
	password?: string,
}

export type CreatePhotoData = {
	title: string,
	url: string,
	comment: string,
	user_id: number,
}

export type UpdatePhotoData = {
	title?: string,
	url?: string,
	comment?: string,
	user_id?: number,
}

export type GetPhotosData = {
	title: string,
	url: string,
	comment: string,
	user_id: number,
}


export type JwtPayload ={
	sub: number,
	first_name: string,
    last_name: string,
	email: string,
	iat?: number,
	exp?: number
}