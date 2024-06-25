// import express, {Request, Response} from 'express'
// import multer from 'multer'
// import cloudinary from 'cloudinary'
// import Hotel, { HotelType } from '../models/hotel';
// import verifyToken from '../middleware/auth';
// import {body} from 'express-validator'
// const router = express.Router();

// const storage = multer.memoryStorage();
// const upload = multer({
//     storage:storage,
//     limits: {
//         fileSize: 5 * 1024 *1024  //5MB
//     }
// })
// // api/my-hotels
// router.post("/",
//     verifyToken, [
//         body("name").notEmpty().withMessage('Name is required'),
//         body("city").notEmpty().withMessage('City is required'),
//         body("country").notEmpty().withMessage('Country is required'),
//         body("description").notEmpty().withMessage('Description is required'),
//         body("type").notEmpty().withMessage('Hotel type is required'),
//         body("pricePerNight").notEmpty().isNumeric().withMessage('Price per night is required and must be a number'),
//         body("facilities").notEmpty().isArray().withMessage('Facilites are required'),

//     ],
//      upload.array("imageFiles", 6) , async(req:Request, res: Response) =>{
//    try{
//     const imageFiles = req.files as Express.Multer.File[];
//     const newHotel: HotelType = req.body;
    

//     // upload the image to cloudinary
//     const uploadPromises = imageFiles.map(async(image)=>{
//         const b64 = Buffer.from(image.buffer).toString("base64")
//         let dataURI = "data:" + image.mimetype + ";base," + b64;
//         const res = await cloudinary.v2.uploader.upload(dataURI)
//         return res.url;
//     })

//     const imageUrls = await Promise.all(uploadPromises);
//      newHotel.imageUrls = imageUrls;
//      newHotel.lastUpdated = new Date();
//      newHotel.userId = req.userId;

//     //if upload was successful, add the URls to the new hotel

//     // save the new hotel in our database
//     const hotel = new Hotel(newHotel);
//     await hotel.save();


//     //return a 201 status
//      res.status(201).send(hotel);

//    }catch(e){
//     console.log("Error creating hotel: ", e);
//     res.status(500).json({message:"Something went wrong"})
//    }
// })

// export default router;




import express, { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import Hotel from '../models/hotel';
import { HotelType } from '../shared/types';
import verifyToken from '../middleware/auth';
import { body } from 'express-validator';

const router = express.Router();

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

// POST endpoint for creating a new hotel
router.post(
    '/',
    verifyToken, // Custom middleware to verify JWT token
    [
        // Express-validator middleware for request body validation
        body('name').notEmpty().withMessage('Name is required'),
        body('city').notEmpty().withMessage('City is required'),
        body('country').notEmpty().withMessage('Country is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('type').notEmpty().withMessage('Hotel type is required'),
        body('pricePerNight')
            .notEmpty()
            .isNumeric()
            .withMessage('Price per night is required and must be a number'),
        body('facilities').notEmpty().isArray().withMessage('Facilities are required'),
    ],
    upload.array('imageFiles', 6), // Multer middleware for uploading images
    async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[]; // Uploaded image files
            const newHotel: HotelType = req.body; // Hotel data from request body

            // Upload the image files to Cloudinary and get URLs
            const imageUrls = await uploadImages(imageFiles);

            // Assign image URLs to the new hotel object
            newHotel.imageUrls = imageUrls;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId; // Assuming `userId` is set in the `verifyToken` middleware

            // Save the new hotel in the database
            const hotel = new Hotel(newHotel);
            await hotel.save();

            // Return a successful response with the created hotel object
            res.status(201).send(hotel);
        } catch (e) {
            console.log('Error creating hotel: ', e);
            res.status(500).json({ message: 'Something went wrong' });
        }
    }
);


router.get('/', verifyToken, async(req:Request, res: Response)=>{

    try{
        const hotels = await Hotel.find({userId: req.userId})
        res.json(hotels);
    }catch(err){
        res.status(500).json({message: "Error fetching hotels"})
    }
})

router.get("/:id", verifyToken, async(req:Request, res:Response) =>{
    const id = req.params.id.toString();
    try{
       const hotel = await Hotel.findOne({
        _id: id,
        userId: req.userId
       });
       res.json(hotel);
    }catch(err) {
        res.status(500).json({message: "Error fetching hotels"})
    }
});

router.put("/:hotelId", verifyToken, upload.array("imageFiles"), async(req:Request, res:Response) => {
    try{
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate({
        _id: req.params.hotelId,
        userId: req.userId,
      },
      updatedHotel,
      {new: true}
    );

    if(!hotel) {
        return res.status(404).json({message: "Hotel not found"});
    }

    // for image files
    const files = req.files as Express.Multer.File[];
    const updatedImageUrls = await uploadImages(files);

    hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || []),];

    await hotel.save();
    res.status(201).json(hotel);
    }catch(err) {
        res.status(500).json({message: "Something went wrong"});
    }
})






async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString('base64');
        const dataURI = 'data:' + image.mimetype + ';base64,' + b64;
        const result = await cloudinary.v2.uploader.upload(dataURI);
        return result.url;
    });

    // Wait for all uploads to complete
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}

export default router;

