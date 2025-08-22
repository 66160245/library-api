const { v4: uuidv4 } = require("uuid"); 

class Author{
    constructor(name, birthYear, nationality, biography){
        this.id = uuidv4();
        this.name = name;
        this.birthYear = birthYear;
        this.nationality = nationality;
        this.biography = biography;
        this.createdAt = new Date().toISOString(); 
        this.updatedAt = new Date().toISOString(); 
    }

    // Validation method 
  static validate(authorData) { 
    const errors = []; 
 
    if (!authorData.name|| authorData.name.trim().length === 0) { 
      errors.push("Name is required"); 
    } 
 
    if ( 
      authorData.birthYear && 
      (authorData.birthYear > new Date().getFullYear()) 
    ) { 
      errors.push("Are you sure ?"); 
    } 
 
    return { 
      isValid: errors.length === 0, 
      errors: errors, 
    }; 
  } 

  // Update method 
  update(newData) { 
    Object.keys(newData).forEach((key) => { 
      if (key !== "id" && key !== "createdAt" && this.hasOwnProperty(key)) { 
        this[key] = newData[key]; 
      } 
    }); 
    this.updatedAt = new Date().toISOString(); 
  } 
 
 
}
 module.exports = Author;