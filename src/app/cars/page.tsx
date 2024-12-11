// app/submit-vehicle/page.tsx

'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    FormHelperText,
    ImageList,
    ImageListItem,
    CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { PhotoCamera } from '@mui/icons-material';
import { submitCar, SubmitCarRequestBody } from "@/api/carsApi";

interface FormValues {
    carModel: string;
    price: number;
    phoneNumber: string;
    numOfPictures: number;
    images: FileList | null;
}

const SubmitVehicle = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm<FormValues>({
        defaultValues: {
            numOfPictures: 1,
            images: null,
        },
    });

    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        setApiError(null);
        setSuccessMessage(null);

        console.log("Form submitted with data:", data);

        const requestBody: SubmitCarRequestBody = {
            carModel: data.carModel,
            price: data.price,
            phoneNumber: data.phoneNumber,
            numOfPictures: data.numOfPictures,
            images: data.images as FileList,
        };

        console.log("Request Body:", requestBody);

        try {
            const response = await submitCar(requestBody);

            console.log("Backend response:", response);

            if (response.status === 201 && response.data.status) {
                setSuccessMessage(response.data.message || 'Vehicle information submitted successfully!');
                reset();
                setPreviewImages([]);
            } else {
                setApiError(response.data.message || 'Unexpected response from the server.');
            }
        } catch (error: any) {
            console.error('Submission error:', error);

            if (error.response && error.response.data && error.response.data.message) {
                setApiError(error.response.data.message);
            } else if (error.message) {
                setApiError(error.message);
            } else {
                setApiError('Failed to submit the form. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            previewImages.forEach((src) => URL.revokeObjectURL(src));

            const selectedFiles = Array.from(files).slice(0, 8);
            const previews = selectedFiles.map((file) => URL.createObjectURL(file));
            setPreviewImages(previews);
            setValue('images', files, { shouldValidate: true });
        }
    };

    useEffect(() => {
        return () => {
            previewImages.forEach((src) => URL.revokeObjectURL(src)); // Clean up preview URLs on unmount
        };
    }, [previewImages]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Typography variant="h4" gutterBottom  color="black">
                Submit Your Vehicle Information
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    mt: 3,
                    p: 4,
                    backgroundColor: '#ffffff',
                    borderRadius: 2,
                    boxShadow: 3,
                    width: { xs: '100%', sm: '80%', md: '60%', lg: '40%' },
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Car Model"
                            variant="outlined"
                            fullWidth
                            {...register('carModel', { required: 'Car model is required' })}
                            error={!!errors.carModel}
                            helperText={errors.carModel?.message}
                        />
                    </Grid>


                    <Grid item xs={12}>
                        <TextField
                            label="Price ($)"
                            type="number"
                            variant="outlined"
                            fullWidth
                            {...register('price', {
                                required: 'Price is required',
                                min: { value: 0, message: 'Price cannot be negative' },
                            })}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Phone Number"
                            variant="outlined"
                            fullWidth
                            {...register('phoneNumber', {
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^\+?[1-9]\d{1,14}$/,
                                    message: 'Invalid phone number',
                                },
                            })}
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber?.message}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth error={!!errors.numOfPictures}>
                            <InputLabel id="num-pictures-label">Number of Pictures</InputLabel>
                            <Controller
                                control={control}
                                name="numOfPictures"
                                rules={{ required: 'Please select number of pictures' }}
                                render={({ field }) => (
                                    <Select
                                        labelId="num-pictures-label"
                                        label="Number of Pictures"
                                        {...field}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                            <MenuItem key={num} value={num}>
                                                {num}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            <FormHelperText>
                                {errors.numOfPictures?.message}
                            </FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<PhotoCamera />}
                        >
                            Upload Images
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                multiple
                                {...register('images')}
                                onChange={handleImageChange}
                            />
                        </Button>
                    </Grid>

                    {previewImages.length > 0 && (
                        <Grid item xs={12}>
                            <ImageList
                                cols={previewImages.length < 3 ? previewImages.length : 3}
                                rowHeight={100}
                                gap={8}
                            >
                                {previewImages.map((src, index) => (
                                    <ImageListItem key={index}>
                                        <img
                                            src={src}
                                            alt={`Preview ${index + 1}`}
                                            loading="lazy"
                                            style={{
                                                objectFit: 'cover',
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: 4,
                                            }}
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Grid>
                    )}

                    {apiError && (
                        <Grid item xs={12}>
                            <Typography color="error" variant="body2" align="center">
                                {apiError}
                            </Typography>
                        </Grid>
                    )}

                    {successMessage && (
                        <Grid item xs={12}>
                            <Typography color="primary" variant="body2" align="center">
                                {successMessage}
                            </Typography>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default SubmitVehicle;
