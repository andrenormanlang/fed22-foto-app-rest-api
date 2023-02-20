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

export type GetPhotosData = {
	id: number,
	title: string,
	url: string,
	comment: string,
	user_id: number,
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

}

export type UpdateAlbumData = {
	title?: string,
}


export type JwtPayload ={
	sub: number,
	first_name: string,
    last_name: string,
	email: string,
	iat?: number,
	exp?: number
}

export type CreateAlbumData = {
	title: string,
	user_id: number,
}

export type GetAllAlbums = {
	title: string,
	user_id: number,
}

export type Album ={
  id: number;
  title: string;
  user_id: number; 
}

export type Photo ={
	id: number;
	user_id: number; 
  }