// src/index.js ma only sever listening code avse main express no code app.js ma hase
import dotenv from 'dotenv';
import { app } from "./app.js";
import { DB_connect } from "./db/index.js";

dotenv.config({
    path: ".env"
});

const port = process.env.PORT || 8001;

DB_connect()
.then(
    () => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        }); 
})
.catch((error) => {
    console.log("DB connection failed:", error);
    
});
    

       
