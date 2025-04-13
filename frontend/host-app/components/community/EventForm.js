import { useForm } from "react-hook-form";
import Button from "../ui/Button";

export default function EventForm({
  onSubmit,
  initialData = {},
  loading = false,
  buttonText = "Create Event",
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
          >
            Event Title
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { required: "Event title is required" })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            rows="3"
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600"
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
          >
            Date & Time
          </label>
          <input
            id="date"
            type="datetime-local"
            {...register("date", { required: "Date is required" })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            {...register("location", { required: "Location is required" })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit" variant="info" disabled={loading}>
          {loading ? "Submitting..." : buttonText}
        </Button>
      </div>
    </form>
  );
}
