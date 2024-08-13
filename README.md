# Photo API

- All passwords are salted and hashed.
- All received data is sanitized and validated.
- All endpoints for photos and albums require authentication using JSON Web Tokens.
- Refresh of access tokens

# Route Map & Endpoints

## Albums

| Method  | Path                              | Comment                                |
|---------|-----------------------------------|----------------------------------------|
| GET     | /albums                           | Get all albums                         |
| GET     | /albums/:albumId                  | Get a single album                     |
| POST    | /albums                           | Create a new album                     |
| PATCH   | /albums/:albumId                  | Update an album                        |
| POST    | /albums/:albumId/photos           | Add a photo an album                   |

### VG

| Method  | Path                              | Comment                                |
|---------|-----------------------------------|----------------------------------------|
| POST    | /albums/:albumId/photos           | Add multiple photos an album           |
| DELETE  | /albums/:albumId/photos/:photoId  | Remove a photo from an album           |
| DELETE  | /albums/:albumId                  | Delete an album                        |

## Photos

| Method  | Path                              | Comment                                |
|---------|-----------------------------------|----------------------------------------|
| GET     | /photos                           | Get all photos                         |
| GET     | /photos/:photoId                  | Get a single photo                     |
| POST    | /photos                           | Create a new photo                     |
| PATCH   | /photos/:photoId                  | Update a photo                         |

### VG

| Method  | Path                              | Comment                                |
|---------|-----------------------------------|----------------------------------------|
| DELETE  | /photos/:photoId                  | Delete a photo                         |

## Users

| Method  | Path                              | Comment                                |
|---------|-----------------------------------|----------------------------------------|
| POST    | /register                         | Register a new user                    |

### VG

| Method  | Path                              | Comment                                |
|---------|-----------------------------------|----------------------------------------|
| POST    | /login                            | Log in a user                          |
| POST    | /refresh                          | Get a new access token                 |

------
------

# Users

## `POST /register`

Register a new user.

### Parameters

*None*

### Body

```json
{
  "email": "andrenormanlang@gmail.com",
  "password": "CatsRule77",
  "first_name": "Andre",
  "last_name": "Lang"
}
```

- `email` *string* **required** must be a valid email *and* not already exist
- `password` *string* **required** must be at least 6 chars long
- `first_name` *string* **required** must be at least 3 chars long
- `last_name` *string* **required** must be at least 3 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "email": "andrenormanlang@gmail.com",
    "first_name": "Andre",
    "last_name": "Lang"
  }
}
```

- `password` **must not** be included in response

------

## `POST /login`

Log in a user.

### Parameters

*None*

### Body

```json
{
  "email": "andrenormanlang@gmail.com",
  "password": "CatsRule77",
}
```

- `email` *string* **required** must be a valid email *and* exist
- `password` *string* **required** must be at least 6 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJKb2hhbiBOb3Jkc3Ryw7ZtIiwiZW1haWwiOiJqbkB0aGVoaXZlcmVzaXN0YW5jZS5jb20iLCJpYXQiOjE2NzU5MzczNzMsImV4cCI6MTY3NTkzNzY3M30.YFKQW0tECCJpwMFhjxBIxkI5GdjRI2BB0YodYzMgVeA",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJKb2hhbiBOb3Jkc3Ryw7ZtIiwiZW1haWwiOiJqbkB0aGVoaXZlcmVzaXN0YW5jZS5jb20iLCJpYXQiOjE2NzU5MzczNzMsImV4cCI6MTY3NTkzODI3M30.14qc-8Sua8d5XEIQoRhLDZk13gRvOPlwR7jbqQ03VoQ"
  }
}
```

------

## **[VG]** `POST /refresh`

Get a new access token.

### Headers

`Authorization: Bearer {refreshToken}`

### Parameters

*None*

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJKb2hhbiBOb3Jkc3Ryw7ZtIiwiZW1haWwiOiJqbkB0aGVoaXZlcmVzaXN0YW5jZS5jb20iLCJpYXQiOjE2NzU5Mzc4MTksImV4cCI6MTY3NTkzODExOX0.F9FcV7zvgVLbAKeLK0vrRW_MPiRyJ49t5xQOtgDlJqs",
  }
}
```

------
------

# Photos

## `GET /photos`

Returns a list of the user's photos.

### Parameters

*None*

### Request

*None*

### Response 200 OK

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "Cindy Sherman",
      "url": "http://utbweb.its.ltu.se/~anolan-1/medieinstitutet/photo-api/cindy-shermann-untitled-C-1975.jpg",
      "comment": "Untitled C, 1975 - Untitled A, B, C and D belong to a more extensive series of photographs Sherman made while she was studying art at the State University College at Buffalo, New York (1972-6). She selected five images from the series and arbitrarily labelled them A to E. They were enlarged and reprinted in editions of ten."
    },
    { 
      "id": 2,
      "title": "Annie Leibovitz",
      "url": "http://utbweb.its.ltu.se/~anolan-1/medieinstitutet/photo-api/AL_1.jpg",
      "comment": "Patti Smith - New York, 1986"
    },
    { 
      "id": 3,
      "title": "Steve McCurry",
      "url": "http://utbweb.its.ltu.se/~anolan-1/medieinstitutet/photo-api/Afghan-Girl-Steve-Mccurry-1984.jpg",
      "comment": "Afghan Girl - Photographic portrait of Sharbat Gula, an Afghan refugee in Pakistan during the Soviet–Afghan War in 1984"
    },
    
  ]
}
```

------

## `GET /photos/:photoId`

Get a single photo.

### Parameters

- `photoId` **required** The id of the photo

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
      "id": 3,
      "title": "Steve McCurry",
      "url": "http://utbweb.its.ltu.se/~anolan-1/medieinstitutet/photo-api/Afghan-Girl-Steve-Mccurry-1984.jpg",
      "comment": "Afghan Girl - Photographic portrait of Sharbat Gula, an Afghan refugee in Pakistan during the Soviet–Afghan War in 1984"   
  }
}
```

------

## `POST /photos`

Create a new photo.

### Parameters

*None*

### Body

```json
{
  "title": "Sebastião Salgado",
  "url": "https://utbweb.its.ltu.se/~anolan-1/medieinstitutet/photo-api/photo2-copy.jpg",
  "comment": "Serra Pelada is a series of photographs taken in 1986 depicting endless numbers of mine workers distributed on various parts of a tall gold mining cliff. The black and white photos were taken from a distance and at an elevated vantage point by photographer Sebastiao Salgado."
}
```

- `title` *string* **required** must be at least 3 chars long
- `url` *string* **required** must be a url
- `comment` *string* must be at least 3 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "title": "Sebastião Salgado",
    "url": "https://utbweb.its.ltu.se/~anolan-1/medieinstitutet/photo-api/photo2-copy.jpg",
    "comment": "Serra Pelada is a series of photographs taken in 1986 depicting endless numbers of mine workers distributed on various parts of a tall gold mining cliff. The black and white photos were taken from a distance and at an elevated vantage point by photographer Sebastiao Salgado."
    "user_id": 1,
    "id": 4
  }
}
```

------

## `PATCH /photos/:photoId`

Update an existing photo.

### Parameters

- `photoId` **required** The id of the photo

### Body

```json
{
  "comment": "Untitled C, 1975 - Untitled A, B, C and D"
}
```

- `title` *string* must be at least 3 chars long
- `url` *string* must be a url
- `comment` *string* must be at least 3 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "title": "Cindy Sherman",
    "url": "http://utbweb.its.ltu.se/~anolan-1/medieinstitutet/photo-api/cindy-shermann-untitled-C-1975.jpg",
    "comment": "Untitled C, 1975 - Untitled A, B, C and D"
    "user_id": 1,
    "id": 1
  }
}
```

------

##  `DELETE /photos/:photoId`

Delete a photo (incl. the **links** to any albums, but not the albums themselves).

### Parameters

- `photoId` **required** The id of the photo

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": null
}
```

------
------

# Albums

## `GET /albums`

Returns a list of the user's albums (excl. photos).

### Parameters

*None*

### Request

*None*

### Response 200 OK

```json
{
  "status": "success",
  "data": [
    
  ]
}
```

------

## `GET /albums/:albumId`

Get a single album, incl. the album's photos.

### Parameters

- `albumId` **required** The id of the album

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "id": 17,
    "title": "Confetti Album",
    "photos": [
      {
        "id": 42,
        "title": "Confetti Photo #1",
        "url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
        "comment": "Confetti",
        "user_id": 4
      },
      {
        "id": 43,
        "title": "Confetti Photo #2",
        "url": "https://images.unsplash.com/photo-1481162854517-d9e353af153d",
        "comment": "Confetti #2",
        "user_id": 4
      },
      {
        "id": 44,
        "title": "Confetti Photo #3",
        "url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
        "comment": "Confetti #3",
        "user_id": 4
      }
    ]
  }
}
```

------

## `POST /albums`

Create a new album.

### Parameters

*None*

### Body

```json
{
  "title": "Portraits of Pain and Dignity"
}

```

```json
{
  "title": "See the Sherman Show"
}

```

- `title` *string* **required** must be at least 3 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "title": "Portraits of Pain and Dignity",
    "user_id": 1,
    "id": 1
  }
}
```

------

## `PATCH /albums/:albumId`

Update an existing album.

### Parameters

- `albumId` **required** The id of the album

### Body

```json
{
  "title": "Confetti'R'Us"
}
```

- `title` *string* **required** must be at least 3 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "title": "Cats Are Awesome",
    "user_id": 1,
    "id": 1
  }
}
```

------

##  `DELETE /albums/:albumId`

Delete an album (incl. the **links** to the photos, but not the photos themselves).

### Parameters

- `albumId` **required** The id of the album

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": null
}
```

------

## `POST /albums/:albumId/photos`

Add a photo to an album.

### Parameters

- `albumId` **required** The id of the album

### Body

```json
{
  "photo_id": 2
}
```

- `photo_id` *integer* **required** must be an existing photo id

### Response

`200 OK`

```json
{
  "status": "success",
  "data": null
}
```

------

##  `POST /albums/:albumId/photos`

Add multiple photos to an album.

### Parameters

- `albumId` **required** The id of the album

### Body

```json
{
  "photo_id": [1, 2, 3]
}
```

- `photo_id` *[integer]* **required** must be an array of existing photo ids

### Response

`200 OK`

```json
{
  "status": "success",
  "data": null
}
```

------

## `DELETE /albums/:albumId/photos/:photoId`

Remove a photo from an album (but not the photo itself!)

### Parameters

- `albumId` **required** The id of the album
- `photoId` **required** The id of the photo

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": null
}
```
