import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormLayout from "../../Layout/FormLayout";
import DropdownSelect from "../Dropdown/DropdownSelect";
import { getCoordinates } from "../../utils/getCoordinates";
import MapPreview from "../Location/MapPreview";
import { useCreateEvent } from "../../hook/useEvent";

const categoryOptions = [
    { value: "health", label: "Health" },
    { value: "education", label: "Education" },
    { value: "environment", label: "Environment" },
    { value: "animals", label: "Animals" },
    { value: "other", label: "Other" },
];

const eventSchema = yup.object({
    name: yup.string().trim().required("Event title is required."),
    description: yup.string().trim().required("Description is required."),
    imageUrl: yup
        .string()
        .url("Image URL must be valid.")
        .nullable()
        .transform((value, originalValue) => (originalValue === "" ? null : value))
        .notRequired(),
    categoryName: yup.string().required("Please select a category."),
    startTime: yup.string().required("Start time is required."),
    endTime: yup
        .string()
        .required("End time is required.")
        .test(
            "is-after-start",
            "End time must be after start time.",
            function (value) {
                const { startTime } = this.parent;
                if (!startTime || !value) return true;
                return new Date(value) > new Date(startTime);
            }
        ),
    capacity: yup
        .number()
        .typeError("Capacity must be a number.")
        .integer("Capacity must be an integer.")
        .min(1, "Capacity must be at least 1.")
        .required("Capacity is required."),
    registrationDeadline: yup
        .string()
        .required("Registration deadline is required."),
    minAge: yup
        .number()
        .typeError("Minimum age must be a number.")
        .min(0, "Minimum age cannot be negative.")
        .nullable()
        .transform((value, originalValue) => (originalValue === "" ? null : value))
        .notRequired(),
    street: yup.string().trim().required("Street is required."),
    city: yup.string().trim().required("City is required."),
    province: yup.string().trim().required("Province is required."),
});

function CreateEvent({ onSuccess, onCancel }) {
    const {
        register,
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(eventSchema),
        defaultValues: {
            name: "",
            description: "",
            imageUrl: "",
            categoryName: "",
            startTime: "",
            endTime: "",
            registrationDeadline: "",
            capacity: "",
            minAge: "",
            street: "",
            district: "",
            province: "",
        },
    });

    const [coordinates, setCoordinates] = useState({ lat: null, lon: null });

    const createEventMutation = useCreateEvent({
        onSuccess: (data, variables, context) => {
            reset();
            setCoordinates({ lat: null, lon: null });
            onSuccess?.(data, variables, context);
        },
    });

    const onSubmit = (values) => {
        const payload = {
            name: values.name,
            description: values.description,
            imageUrl: values.imageUrl || undefined,
            categoryName: values.categoryName,
            startTime: values.startTime,
            endTime: values.endTime,
            registrationDeadline: values.registrationDeadline,
            capacity: values.capacity,
            address: {
                street: values.street,
                district: values.city,
                province: values.province,
            },
        };

        createEventMutation.mutate(payload);
    };

    const street = watch("street");
    const city = watch("city");
    const province = watch("province");

    const addressString = useMemo(
        () => [street, city, province].filter(Boolean).join(", ") || "",
        [street, city, province]
    );

    useEffect(() => {
        if (!addressString) {
            setCoordinates((prev) => {
                if (prev.lat === null && prev.lon === null) {
                    return prev;
                }
                return { lat: null, lon: null };
            });
            return;
        }

        const handler = setTimeout(async () => {
            try {
                const coords = await getCoordinates(addressString);
                setCoordinates((prev) => {
                    const nextLat = coords ? Number(coords.lat) : null;
                    const nextLon = coords ? Number(coords.lon) : null;
                    if (prev.lat === nextLat && prev.lon === nextLon) {
                        return prev;
                    }
                    return { lat: nextLat, lon: nextLon };
                });
            } catch (error) {
                console.error("Error fetching coordinates:", error);
                setCoordinates((prev) => {
                    if (prev.lat === null && prev.lon === null) {
                        return prev;
                    }
                    return { lat: null, lon: null };
                });
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [addressString]);

    return (
        <FormLayout
            title="Create New Event"
            description="Fill in the event information. All fields marked with * are required."
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label htmlFor="name">Event Title *</label>
                    <input
                        type="text"
                        id="name"
                        {...register("name")}
                        placeholder="Beach Cleanup Drive"
                        className="w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="category">Category *</label>
                    <Controller
                        name="categoryName"
                        control={control}
                        render={({ field }) => (
                            <DropdownSelect
                                value={field.value}
                                onChange={field.onChange}
                                options={categoryOptions}
                                placeholder="Select category"
                                className="w-full"
                            />
                        )}
                    />
                    {errors.categoryName && (
                        <p className="text-sm text-red-500">
                            {errors.categoryName.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="description">Description *</label>
                <textarea
                    id="description"
                    rows={4}
                    {...register("description")}
                    placeholder="Describe your volunteer opportunity..."
                    className="w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label htmlFor="startTime">Start Time *</label>
                    <input
                        type="datetime-local"
                        id="startTime"
                        {...register("startTime")}
                        className="w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.startTime && (
                        <p className="text-sm text-red-500">{errors.startTime.message}</p>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="endTime">End Time *</label>
                    <input
                        type="datetime-local"
                        id="endTime"
                        {...register("endTime")}
                        className="w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.endTime && (
                        <p className="text-sm text-red-500">{errors.endTime.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                    <label htmlFor="capacity">Max Volunteers *</label>
                    <input
                        type="number"
                        id="capacity"
                        {...register("capacity", { valueAsNumber: true })}
                        min="1"
                        className="w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.capacity && (
                        <p className="text-sm text-red-500">{errors.capacity.message}</p>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="registrationDeadline">Registration Deadline *</label>
                    <input
                        type="datetime-local"
                        id="registrationDeadline"
                        {...register("registrationDeadline")}
                        className="w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.registrationDeadline && (
                        <p className="text-sm text-red-500">
                            {errors.registrationDeadline.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label>Location *</label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="street" className="text-sm text-gray-600">
                            Street
                        </label>
                        <input
                            type="text"
                            id="street"
                            {...register("street")}
                            placeholder="123 Beach St"
                            className="w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.street && (
                            <p className="text-sm text-red-500">{errors.street.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="city" className="text-sm text-gray-600">
                            District
                        </label>
                        <input
                            type="text"
                            id="city"
                            {...register("city")}
                            placeholder="Da Nang"
                            className="w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.city && (
                            <p className="text-sm text-red-500">{errors.city.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="province" className="text-sm text-gray-600">
                            Province
                        </label>
                        <input
                            type="text"
                            id="province"
                            {...register("province")}
                            placeholder="Da Nang"
                            className="w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.province && (
                            <p className="text-sm text-red-500">{errors.province.message}</p>
                        )}
                    </div>
                </div>
                <div className="mt-4">
                    <MapPreview
                        lat={coordinates.lat}
                        lon={coordinates.lon}
                        address={addressString}
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => {
                        reset();
                        setCoordinates({ lat: null, lon: null });
                        onCancel?.();
                    }}
                    className="flex-1 rounded-2xl border border-gray-300 px-5 py-3 text-base font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={createEventMutation.isPending}
                    className="flex-1 rounded-2xl bg-red-400 px-5 py-3 text-base font-semibold text-white shadow-lg hover:bg-red-600 transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {createEventMutation.isPending ? "Creating..." : "Create Event"}
                </button>
            </div>
        </FormLayout>
    );
}

export default CreateEvent;
