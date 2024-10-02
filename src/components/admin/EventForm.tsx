import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
// import { Textarea } from "@/components/ui/textarea"
import { TimePicker } from "@/components/admin/time/time-picker";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import FileUpload from "@/components/admin/FileUpload";
import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles

import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],

    ["link"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

const EventFormSchema = z.object({
  event_name: z.string().min(4, "Event name must be at least 4 characters."),
  description: z.string().optional(),
  // rules: z.string().optional(),
  day_number: z.number().min(1, "Day number must be at least 1.").int(),
  time: z
    .string()
    .refine(
      (time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(time),
      {
        message: "Invalid time format.",
        path: [],
      }
    ),
  venue: z.string().optional(),
  society_name: z.string().max(50),
  pocs: z
    .array(
      z.object({
        name: z.string().max(40).optional(),
        phone: z.string().max(14).optional(),
      })
    )
    .max(3, "You can add up to 3 POCs only."),
  banner_url_1: z.string().optional(),
  banner_url_1_compressed: z.string().optional(),
  banner_url_2: z.string().optional(),
  banner_url_2_compressed: z.string().optional(),
  registration_link: z.string().optional(),
});

type ImageUrls = {
  original: string | null;
  compressed: string | null;
};

export function EventsInputForm() {
  const [banner1Url, setBanner1Url] = useState<string | null>(null);
  const [banner2Url, setBanner2Url] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (file1: File | null, file2: File | null) => {
    setSelectedFile1(file1);
    setSelectedFile2(file2);
  };
  const form = useForm<z.infer<typeof EventFormSchema>>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      pocs: [{ name: "", phone: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pocs",
  });
  const { user } = useAuth();

  const [selectedFile1, setSelectedFile1] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);
  const handleFilesUpload = async (): Promise<{
    banner1Urls: ImageUrls;
    banner2Urls: ImageUrls;
  }> => {
    let banner1Response: ImageUrls = { original: null, compressed: null };
    let banner2Response: ImageUrls = { original: null, compressed: null };

    if (selectedFile1) {
      banner1Response = await uploadToBackend(selectedFile1, setBanner1Url);
    }
    if (selectedFile2) {
      banner2Response = await uploadToBackend(selectedFile2, setBanner2Url);
    }

    return {
      banner1Urls: banner1Response,
      banner2Urls: banner2Response,
    };
  };
  const uploadToBackend = async (
    file: File,
    setBannerUrl: React.Dispatch<React.SetStateAction<string | null>>
  ): Promise<ImageUrls> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const { original, compressed } = response.data;
        console.log("Received URL1:", original);

        setBannerUrl(original); // Update the banner URL to be the original one
        return { original, compressed };
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to upload the file.",
      });
    }

    setBannerUrl(null); // set the banner URL to null in error cases
    return { original: null, compressed: null }; // ensure you return null for both in all other cases
  };

  async function onSubmit(data: z.infer<typeof EventFormSchema>) {
    setIsLoading(true);

    const { banner1Urls, banner2Urls } = await handleFilesUpload();

    if (
      (selectedFile1 && !banner1Urls.original) ||
      (selectedFile2 && !banner2Urls.original)
    ) {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          "One or more selected files failed to upload. Event registration halted.",
      });
      setIsLoading(false);
      return;
    }

    const formDataWithImages = {
      ...data,
      banner_url_1: banner1Urls.original,
      banner_url_1_compressed: banner1Urls.compressed,
      banner_url_2: banner2Urls.original,
    };

    const token = user?.token;

    if (!token) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Admin is not authenticated. Please login to continue.",
      });
      setIsLoading(false);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/registerevent`,
        formDataWithImages,
        config
      )
      .then((response) => {
        if (response.status === 200) {
          toast({ title: "Successfully added event!" });
        } else {
          toastError(response.data);
        }
      })
      .catch((error) => {
        toastError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function toastError(description: string) {
    toast({
      title: "Error",
      variant: "destructive",
      description,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="flex gap-5 w-full">
          {" "}
          {/* <-- Make sure this is full width */}
          <div className="flex space-x-4 w-full">
            {/* Event Name and Society Name */}
            <div className="md:flex gap-5 space-y-4 md:space-y-0   w-full">
              <FormField
                control={form.control}
                name="event_name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    {" "}
                    {/* <-- Updated */}
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="society_name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    {" "}
                    {/* <-- Updated */}
                    <FormLabel>Society Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Society name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Day Number */}
            <FormField
              control={form.control}
              name="day_number"
              render={({ field }) => (
                <FormItem className="flex-grow-0 flex-shrink-1 w-auto min-w-max">
                  <FormLabel>Day Number</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(val) => field.onChange(Number(val))} // Convert string to number
                      value={field.value ? field.value.toString() : ""}
                    >
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="DAY" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="1">Day 1</SelectItem>
                          <SelectItem value="2">Day 2</SelectItem>
                          <SelectItem value="3">Day 3</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className="md:w-24 flex-grow-0 flex-shrink-1 w-auto">
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <TimePicker
                      onChange={(value) => {
                        // Format the time value
                        const formattedTime = `${String(value.hour).padStart(
                          2,
                          "0"
                        )}:${String(value.minute).padStart(2, "0")}:00`;
                        // Update the form field with the formatted time
                        field.onChange(formattedTime);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex gap-5 w-full">
          {" "}
          {/* <-- Parent flex container to ensure full width */}
          <div className="md:flex md:space-x-4 space-y-4  md:space-y-0 w-full">
            {" "}
            {/* <-- Child flex container for the form fields */}
            {/* Registration Link */}
            {/* Venue */}
            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem className=" md:w-72 flex-grow-0 flex-shrink-1 w-auto min-w-max ">
                  {" "}
                  {/* <-- Small width */}
                  <FormLabel>Venue</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter venue (Nescii Lawns, etc)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registration_link"
              render={({ field }) => (
                <FormItem className="flex-1">
                  {" "}
                  {/* <-- Takes maximum width */}
                  <FormLabel>Registration Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter registration link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Event Type */}
            {/* <FormField
              control={form.control}
              name="event_type"
              render={({ field }) => (
                <FormItem className="md:w-36 flex-grow-0 flex-shrink-1 w-auto min-w-max">
                  <FormLabel>Event Type</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter event type" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="py-4">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <ReactQuill
                  value={field.value}
                  onChange={(content) => {
                    field.onChange({
                      target: {
                        name: field.name,
                        value: content,
                      },
                    });
                  }}
                  className="w-full bg-transparent h-56 my-quill-editor"
                  modules={modules}
                  formats={formats}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ... Add other fields similarly ... */}

        {/* <FormField
          control={form.control}
          name="rules"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rules</FormLabel>
              <FormControl>
                <textarea className="w-full p-2 border rounded" placeholder="Enter rules" {...field}></textarea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* ... similar pattern for the rest of the fields ... */}

        <div className="md:flex pt-24 md:pt-10 gap-12 ">
          <div className="mt-0 sm:mt-5 ">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
          <div className="w-full">
            {fields.map((field, index) => (
              <div key={field.id} className="flex mb-4 gap-5">
                {/* Name Field */}
                <div className="flex w-full flex-col">
                  <FormLabel className="mb-2">{`POC ${index + 1}`}</FormLabel>
                  <FormField
                    control={form.control}
                    name={`pocs.${index}.name`}
                    render={({ field }) => (
                      <>
                        <Input
                          placeholder={`Enter name for POC ${index + 1}`}
                          {...field}
                        />
                        <FormMessage />
                      </>
                    )}
                  />
                </div>

                {/* Phone Field */}
                <div className="flex w-full flex-col">
                  <FormLabel className="mb-2 invisible">Placeholder</FormLabel>
                  <FormField
                    control={form.control}
                    name={`pocs.${index}.phone`}
                    render={({ field }) => (
                      <>
                        <Input
                          placeholder={`Enter phone for POC ${index + 1}`}
                          {...field}
                        />
                        <FormMessage />
                      </>
                    )}
                  />
                </div>

                {/* Remove Button */}
                {fields.length > 1 && (
                  <div>
                    <FormLabel className=" mb-2 invisible">x</FormLabel>

                    <Button
                      type="button"
                      className="flex w-10   items-center justify-center"
                      onClick={() => remove(index)}
                    >
                      <X className="-m-10 " />
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* Add POC Button */}
            {fields.length < 3 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mb-6 mb:mb-0"
                onClick={() => append({ name: "", phone: "" })}
              >
                Add POC
              </Button>
            )}
          </div>
        </div>

        {/* ... Add other fields similarly ... */}

        <Button disabled={isLoading} type="submit">
          {" "}
          {isLoading && <Loader2 className=" mr-1 h-4 w-4 animate-spin" />}
          {isLoading ? "Submitting..." : "Submit"}{" "}
        </Button>
      </form>
    </Form>
  );
}
