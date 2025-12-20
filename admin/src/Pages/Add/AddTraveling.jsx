import React from 'react'

const AddTraveling = () => {
  return (
    <div>
        <h1>Add Traveling Places</h1>

        <form>
            <div>
                <label>Place Name:</label>
                <input type = "text" placeholder='add name' />
            </div>

            <div>
                <label>Place Description:</label>
                <input type = "text" placeholder='add description' />
            </div>

            <div>
                <label>Select district:</label>
                <select>
                    <option value="colombo">Colombo</option>
                    <option value="galle">Galle</option>
                    <option value="kandy">Kandy</option>    
                    <option value="nuwaraeliya">Nuwara Eliya</option>
                    <option value="trincomalee">Trincomalee</option>
                    <option value="jaffna">Jaffna</option>  
                    <option value="anuradhapura">Anuradhapura</option>
                    <option value="polonnaruwa">Polonnaruwa</option>  
                    <option value="hambantota">Hambantota</option>  
                    <option value="badulla">Badulla</option>
                    <option value="gampaha">Gampaha</option>  
                    <option value="matara">Matara</option>  
                    <option value="kurunegala">Kurunegala</option>  
                    <option value="ratnapura">Ratnapura</option>  
                    <option value="kalutara">Kalutara</option>
                    <option value="puttalam">Puttalam</option>  
                    <option value="jaffna">Jaffna</option>  
                    <option value="monaragala">Monaragala</option>  
                    <option value="ampara">Ampara</option>  
                    <option value="trincomalee">Trincomalee</option>  
                    <option value="batticaloa">Batticaloa</option> 
                    <option value="matale">Matale</option>  
                    <option value="kegalle">Kegalle</option>

                </select>
            </div>
            <div>
                <label>Upload main Image:</label>
                <input type = "file" />
            </div>
            <div>
                <label>Upload Images:</label>
                <input type = "file" multiple />
            </div>
            <button type='submit'>Add Place</button>
            
    </form>
       
        
    </div>
  )
}

export default AddTraveling