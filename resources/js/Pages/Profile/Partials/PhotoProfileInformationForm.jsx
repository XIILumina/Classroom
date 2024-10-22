import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function UpdateProfilePhoto({ auth, className = "" }) {
    const { data, setData, post, errors, processing } = useForm({
        avatar: null,
    });
    
    const [selectedImage, setSelectedImage] = useState(null);
    const [photoUpdated, setPhotoUpdated] = useState(false);

    useEffect(() => {
        fetch("/api/image/get")
            .then((response) => response.json())
            .then((data) => {
                setSelectedImage("/storage/" + data.photo[0]);
            });
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData("avatar", file);
        setSelectedImage(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("avatar", data.avatar);

        post(route("profile.photo.update"), {
            data: formData,
            onSuccess: () => {
                setPhotoUpdated(true);
            },
            onError: () => {
                setPhotoUpdated(false);
            },
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Update Profile Photo
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Upload a new photo for your profile.
                </p>
            </header>

            <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-6"
                encType="multipart/form-data"
            >
                <div>
                    <InputLabel htmlFor="avatar" value="Profile Photo" />
                    <input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-1 block w-full"
                    />
                    <InputError className="mt-2" message={errors.avatar} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>
                    {photoUpdated && (
                        <p className="text-sm text-green-600">
                            Profile photo updated!
                        </p>
                    )}
                </div>
            </form>

            {selectedImage ? (
                <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        Preview:
                    </h3>
                    <img
                        src={selectedImage}
                        alt={"/storage/" + selectedImage}
                        className="mt-2 w-32 h-32 object-cover rounded-full border"
                    />
                </div>
            ):
            null}
        </section>
    );
}
