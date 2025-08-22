const { v4: uuidv4 } = require("uuid"); 
 
class Category { 
  constructor(name, description) { 
    this.id = uuidv4(); 
    this.name = name; 
    this.description = description; 
    this.createdAt = new Date().toISOString(); 
    this.updatedAt = new Date().toISOString(); 
  }


  // Validation method 
  static validate(cateData) { 
    const errors = []; 
 
    if (!cateData.name || cateData.name.trim().length === 0) { 
      errors.push("Name is required"); 
    } 
    return { 
      isValid: errors.length === 0, 
      errors: errors, 
    }; 
  } 

   update(newData) { 
    Object.keys(newData).forEach((key) => { 
      if (key !== "id" && key !== "createdAt" && this.hasOwnProperty(key)) { 
        this[key] = newData[key]; 
      } 
    }); 
    this.updatedAt = new Date().toISOString(); 
  } 


}
module.exports = Category;