# Endpoints

## Photos

### `GET /photos`

Get all photos.

### `GET /photos/:photoId`

Get one photo.

### `POST /photos`

```json
{
  "title": "Dorothea Lange",
  "url": "https://utbweb.its.ltu.se/~anolan-1/medieinstitutet/photo-api/Migrant-Mother-photograph-Nipomo-California-Dorothea-Lange-1936.webp",
  "comment": "Migrant Mother - Nipomo, California, 1936"
}
```

```json
{
  "title": "Sebastião Salgado",
  "url": "https://utbweb.its.ltu.se/~anolan-1/medieinstitutet/photo-api/photo2-copy.jpg",
  "comment": "Serra Pelada is a series of photographs taken in 1986 depicting endless numbers of mine workers distributed on various parts of a tall gold mining cliff. The black and white photos were taken from a distance and at an elevated vantage point by photographer Sebastiao Salgado."
}
```

```json
{
  "title": "Steve McCurry",
  "url": "http://utbweb.its.ltu.se/~anolan-1/medieinstitutet/photo-api/Afghan-Girl-Steve-Mccurry-1984.jpg",
  "comment": "Afghan Girl - Photographic portrait of Sharbat Gula, an Afghan refugee in Pakistan during the Soviet–Afghan War in 1984"
}
```

```json
{
  "title": "Annie Leibovitz",
  "url": "http://utbweb.its.ltu.se/~anolan-1/medieinstitutet/photo-api/AL_1.jpg",
  "comment": "Patti Smith - New York, 1986"
}
```

```json
{
  "title": "Cindy Sherman",
  "url": "http://utbweb.its.ltu.se/~anolan-1/medieinstitutet/photo-api/830_1995_RICR-Press%20Site.jpg",
  "comment": "Untitled Film Still #21, 1978 - Between 1977 and 1980 Sherman photographed herself in a series of sixty-seven scenarios staged to suggest the cinematic tropes of midcentury Hollywood"
}
```

```json
{
  "title": "Cindy Sherman",
  "url": "http://utbweb.its.ltu.se/~anolan-1/medieinstitutet/photo-api/cindy-shermann-untitled-C-1975.jpg",
  "comment": "Untitled C, 1975 - Untitled A, B, C and D belong to a more extensive series of photographs Sherman made while she was studying art at the State University College at Buffalo, New York (1972-6). She selected five images from the series and arbitrarily labelled them A to E. They were enlarged and reprinted in editions of ten."
}
```

```json
{
  "title": "Cindy Sherman",
  "url": "http://utbweb.its.ltu.se/~anolan-1/medieinstitutet/photo-api/P78503_9.jpg",
  "comment": "Untitled - 1976"
}
```

## Album

### `GET /albums`

Get all albums.

### `GET /albums/:albumsId`

Get album details, including photos.

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

### `POST /albums`

```json
{
  "title": "Portraits of Pain and Dignity"
}

```

## User

## `POST /register`

Register a new user.

```json
{
  "first_name": "Johan ",
  "last_name": "Nordström",
  "email": "jn@thehiveresistance.con",
  "password": "abc123"
}
```
