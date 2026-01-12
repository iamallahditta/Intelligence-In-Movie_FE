import { z } from 'zod';

// Define the Signup schema
const LoginSchema = z.object({
 

  email: z.string().email("Invalid email format"), 
  password: z.string().min(1, "Please enter password"), 
  
});

export default LoginSchema;
