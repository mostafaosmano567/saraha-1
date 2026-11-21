import Router from "express";
import joi from "joi"
import * as US from "./user.service.js";
import { authentication } from "../../common/middleware/authentcation.js";
import { authorization } from "../../common/middleware/authorization.js";
import { userEnum } from "../../common/enum/user.enum.js";
import { validation } from "../../common/middleware/validation.js";
import { refreshTokenSchema, shareProfileSchema, updatePasswordSchema, updateProfileSchema, userValidationSchemaSignin, userValidationSchemaSignup } from "./user.validation.js";
import { readystorage } from "../../common/middleware/multer.js";

export const userRouter = Router();

//const upload= Multer()


userRouter.post('/signup',
    readystorage({customPath:"users",customTypes:["image/jpg"]}).fields([
        {
        name:"attachments"
        ,maxCount:2},
        {
        name:"attachment"
        ,maxCount:1}
    ]),validation(userValidationSchemaSignup),US.signup)


userRouter.post('/signin',validation(userValidationSchemaSignin),US.signin)

userRouter.get('/profile',authentication,authorization(Object.values(userEnum)),US.getProfile)

userRouter.get('/profile/share/:id',validation(shareProfileSchema),US.shareProfile)

userRouter.get('/refreshToken',validation(refreshTokenSchema),US.refreshToken)

userRouter.get('/profile/import_photos',authentication,authorization(Object.values(userEnum)),US.import_files)

userRouter.patch("/profile/update",authentication,authorization(Object.values(userEnum)),validation(updateProfileSchema),US.updateProfile)

userRouter.post("/confirm-email",US.confirmEmail)

userRouter.patch("/profile/update-password",authentication,authorization(Object.values(userEnum)),validation(updatePasswordSchema),US.updatePassword)

userRouter.patch('/profile/logout',authentication,authorization(Object.values(userEnum)),US.logout)

userRouter.post('/signUp/gmail',US.signupWithGmail)


