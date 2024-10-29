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
    const [imageSelected, setImageSelected] = useState(false); // Новое состояние

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
        setImageSelected(!!file); // Установим состояние в true, если файл выбран
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("avatar", data.avatar);

        post(route("profile.photo.update"), {
            data: formData,
            onSuccess: () => {
                setPhotoUpdated(true);
                setImageSelected(false); // Сбросить состояние после успешного обновления
            },
            onError: () => {
                setPhotoUpdated(false);
            },
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <section className={`${className} flex flex-col md:flex-row items-start`}>
            <div className="md:w-1/2">
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
                        <div className="mt-1">
                            <input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden" // Скрываем оригинальный input
                            />
                            <label
                                htmlFor="avatar"
                                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Choose File
                            </label>
                        </div>
                        <InputError className="mt-2" message={errors.avatar} />
                    </div>

                    <div className="flex items-center gap-4">
                        {imageSelected && ( // Условный рендеринг кнопки Save
                            <PrimaryButton disabled={processing}>Save</PrimaryButton>
                        )}
                        {photoUpdated && (
                            <p className="text-sm text-green-600">
                                Profile photo updated!
                            </p>
                        )}
                    </div>
                </form>
            </div>

            <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
                {selectedImage && (
                    <div className="text-center">
                        <img
                            src={selectedImage}
                            alt="Profile Preview"
                            className="w-32 h-32 object-cover rounded-full border"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
