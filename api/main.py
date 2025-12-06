from fastapi import FastAPI,Form
import mysql.connector
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

conn=mysql.connector.connect(
    host="localhost",
    user="root",
    password="54321",
    database="mydbfirst"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message":"Hello World"}

@app.get("/get_tasks")
def get_tasks():
    cursor=conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Todo")
    records=cursor.fetchall()
    return records

@app.post("/add_task")
def add_task(task: str=Form(...)):
    cursor=conn.cursor()
    cursor.execute("INSERT INTO Todo (task) VALUES (%s)", (task,))
    conn.commit()
    return {"Task added successfully"}

@app.post("/delete_task")
def add_task(id: str=Form(...)):
    cursor=conn.cursor()
    cursor.execute("DELETE FROM Todo where id = %s", (id,))
    conn.commit()
    return {"Task deleted successfully"}