# library-api

<!-- Install project. -->
- npm init -y
- npm install express cors morgan uuid
- npm install nodemon --save-dev

<!-- Run project. -->
- npm start // รันแบบปกติ
- npm run dev // รับแบบให้ nodemon 


<!-- Books Endpoints. -->
| Method | Path             | คำอธิบาย                     
|--------|------------------|----------------------------
| GET    | /api/books       | ดึงรายการหนังสือทั้งหมด         
| GET    | /api/books/:id   | ดึงข้อมูลหนังสือตาม ID          
| POST   | /api/books       | เพิ่มหนังสือใหม่                
| PUT    | /api/books/:id   | แก้ไขข้อมูลหนังสือ               
| DELETE | /api/books/:id   | ลบหนังสือ   

<!-- authors Endpoints. -->
| Method | Path               | คำอธิบาย                     
|--------|--------------------|---------------------------
| GET    | /api/authors       | ดึงรายการผู้เขียนทั้งหมด      
| GET    | /api/authors/:id   | ดึงข้อมูลผู้เขียนตาม ID       
| POST   | /api/authors       | เพิ่มผู้เขียนใหม่             
| PUT    | /api/authors/:id   | แก้ไขข้อมูลผู้เขียน          
| DELETE | /api/authors/:id   | ลบผู้เขียน    
                               
<!-- categories Endpoints. -->
| Method | Path                 | คำอธิบาย                       
|--------|----------------------|--------------------------
| GET    | /api/categories      | ดึงรายการหมวดหมู่ทั้งหมด        
| GET    | /api/categories/:id  | ดึงข้อมูลหมวดหมู่ตาม ID         
| POST   | /api/categories      | เพิ่มหมวดหมู่ใหม่               
| PUT    | /api/categories/:id  | แก้ไขข้อมูลหมวดหมู่            
| DELETE | /api/categories/:id  | ลบหมวดหมู่                             