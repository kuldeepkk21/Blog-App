import React, { useEffect } from 'react'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from "../index"
import service from '../../appwrite/database'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PostForm({...post}) {

    const {register, handleSubmit, setValue, 
    getValues, watch, control} = useForm({
        defaultValues: {
            title: post?.title || "",
            content: post?.content || "",
            slug: post?.slug || "",
            status: post?.status || "active",
        }
    })

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    
    const submit = async (data) => {
        if ((Object.keys(post).length !== 0)) {
            const file = data.image[0] ? 
            await service.uploadFile(data.image[0]) : null
            if (file) {
                service.deleteFile(post.image)
            }
            const dbPost = await service.updatePost(
                {...data, image: file ? file.$id : undefined }
            ) 
            if (dbPost) {
                navigate(`/post/${dbPost.$id}`)
            }
        } else {
            const file = await service.uploadFile(data.image[0])
            if (file) {
                const fileId = file.$id;
                data.image = fileId;
                const dbPost = await service.createPost(
                    { ...data, userID: userData.$id }
                )
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }      
        }
    }
    
    const slugTransform = useCallback((value) => {
        if (value && typeof value === 'string') {
            return value.trim().toLowerCase().replace(/\s/g, '-')
        }
        return "";
    }, [])

    useEffect( () => {
        const subscription = watch( (value, {name}) => {
            if (name === "title") {
                const slug = slugTransform(value.title, {shouldValidate: true})
                setValue("slug", slug)
            }
        })
        return () => subscription.unsubscribe()
    }, [slugTransform, watch, setValue])
    
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />

                {(Object.keys(post).length === 0) ? null : (
                    <div className="w-full mb-4">
                        <img
                            src={service.getFileView(post.image)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" className="w-full">
                    {(Object.keys(post).length === 0) ? "Submit" : "Update"}
                </Button>
            </div>
        </form>
  )
}

export default PostForm
