from fastapi import FastAPI, HTTPException

app = FastAPI()

counter = 1

message_history = {}


@app.get("/")
async def root():
    counter += 1
    return {"message": f"Hello World {counter}"}


@app.get("/hello")
async def test():
    return {"message": "kult"}


@app.post("/message")
async def send_message(message: str):
    if len(message) == 0 or message.lower() == "cogito er ikke kult":
        raise HTTPException(status_code=400, detail="Error extracting text")

    global counter
    counter += 1
    message_history[counter] = message
    return {"message": "Message OK"}


@app.get("/message")
async def get_message():
    return {"message": message_history}


@app.delete("/message")
async def delete_message(id: int):
    if id not in message_history:
        raise HTTPException(status_code=404, detail="Message not found")
    message = message_history.pop(id)
    return {"message": f"Message {message} deleted"}


@app.put("/message")
async def update(id: int, value: str):
    if id not in message_history:
        raise HTTPException(status_code=404, detail="Message not found")
    message_history[id] = value
    return {"message": f"Message {id} updated to {value}"}
