import os
import mimetypes
import uuid
import asyncpg
from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from urllib.parse import unquote


app = FastAPI()

current_directory = os.path.dirname(os.path.abspath(__file__))
profile_images_directory = os.path.join(current_directory, "profile_images")
scrolling_images_directory = os.path.join(current_directory, "scrolling_images")

os.makedirs(profile_images_directory, exist_ok=True)
os.makedirs(scrolling_images_directory, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def create_db_pool():
    return await asyncpg.create_pool(user="operator", password="qpwoeivb1029",
                                     database="Symfony", host="127.0.0.1", port="5432")

async def insert_image_record(user_id, text , image_id, image_name, pool):
    try:
        async with pool.acquire() as connection:
            await connection.execute("INSERT INTO images (user_id, image_id, image_name, post_text) VALUES ($1, $2, $3, $4)",
                                     user_id, image_id, image_name, text)
    except Exception as e:
        print(f"Error inserting data into the database: {e}")

@app.on_event("startup")
async def startup_event():
    app.state.pool = await create_db_pool()

@app.on_event("shutdown")
async def shutdown_event():
    await app.state.pool.close()


@app.post('/upload-image')
async def upload_image(image: UploadFile = File(...), username: str = Body(...), userid: str = Body(...)):
    try:
        if not image:
            raise HTTPException(status_code=400, detail='No image provided')
        
        username = unquote(username + "_" + userid)
        
        save_path = os.path.join(profile_images_directory, f"{username}.jpg")
        with open(save_path, 'wb') as f:
            f.write(await image.read())
        
        return {'message': 'Image uploaded successfully'}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get('/profile-image/{username}_{userid}')
async def get_profile_image(username: str, userid: str):
    try:
        image_path = os.path.join(profile_images_directory, f"{username + '_' + userid}.jpg")
        if os.path.exists(image_path):
            mime_type, _ = mimetypes.guess_type(image_path)
            return FileResponse(image_path, media_type=mime_type)
        else:
            raise HTTPException(status_code=404, detail='Profile image not found')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/upload-image-scrolling')
async def upload_image_scrolling(image: UploadFile = File(...),  text: str = Body(...), username: str = Body(...), userid: str = Body(...)):
    try:
        if not image:
            raise HTTPException(status_code=400, detail='No image provided')
        
        unique_id = str(uuid.uuid4())
        imgname = unquote(username + '_' + userid + '_' + unique_id)
        
        scrolling_images_directory_user = os.path.join(scrolling_images_directory, userid)
        os.makedirs(scrolling_images_directory_user, exist_ok=True)

        save_path = os.path.join(scrolling_images_directory_user, f"{imgname}.jpg")
        with open(save_path, 'wb') as f:
            f.write(await image.read())
        
        await insert_image_record(userid, text, unique_id, imgname, app.state.pool)
        
        return {'message': 'Image uploaded successfully'}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get('/get-image-scrolling/{userid}')
async def get_scrolling_images(userid: str):
    try:
        async with app.state.pool.acquire() as connection:
            query = "SELECT image_name, post_text FROM images WHERE user_id = $1"
            rows = await connection.fetch(query, userid)
            
            file_responses = []
            for row in rows:
                file_responses.append({
                    'image_name': row['image_name'],
                    'post_text': row['post_text']
                })

            return file_responses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/get_images/{imagename}_{userid}')
async def get_image_by_name(imagename: str, userid: str):
    try:
        image_path = os.path.join(scrolling_images_directory, userid, f"{imagename}.jpg")
        print("Image Path:", image_path)
        if os.path.exists(image_path):
            mime_type, _ = mimetypes.guess_type(image_path)
            return FileResponse(image_path, media_type=mime_type)
        else:
            raise HTTPException(status_code=404, detail='Image not found')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.get('/get-all-posts')
async def get_all_posts():
    try:
        async with app.state.pool.acquire() as connection:
            query = "SELECT images.image_id, images.image_name, images.user_id, images.post_text, userregistration.name FROM images INNER JOIN userregistration ON images.user_id::varchar = userregistration.id::varchar"
            rows = await connection.fetch(query)
            
            all_posts = []
            for row in rows:
                all_posts.append({
                    'post_id': row['image_id'],
                    'image_name': row['image_name'],
                    'user_id': row['user_id'],
                    'username': row['name'],
                    'content': row['post_text']
                })
            
            return all_posts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

