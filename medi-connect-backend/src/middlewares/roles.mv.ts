import { Request, Response, NextFunction } from "express";

// Verify if the authenticated user has the "doctor" role
export const verifyDoctorRole = (req: Request, res: Response, next: NextFunction) => {
    const authenticatedUserId = req.user?.id;

    if (!authenticatedUserId) {
        return res.status(401).json({
            success: false,
            message: "User is not authenticated",
        });
    }

    if (req.user?.role !== "doctor") {
        return res.status(403).json({
            success: false,
            message: "Only doctors can perform this action",
        });
    }

    next();
};

// Verify if the authenticated user has the "patient" role
export const verifyPatientRole = (req: Request, res: Response, next: NextFunction) => {
    const authenticatedUserId = req.user?.id;

    if (!authenticatedUserId) {
        return res.status(401).json({
            success: false,
            message: "User is not authenticated",
        });
    }

    if (req.user?.role !== "patient") {
        return res.status(403).json({
            success: false,
            message: "Only patients can perform this action",
        });
    }

    next();
};
