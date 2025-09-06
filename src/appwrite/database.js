import { use } from "react";
import config from "../config/config";
import { Client, Databases, Storage, ID, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    
    constructor() {
        this.client
            .setEndpoint(config.appwriteURL)
            .setProject(config.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, content, image, slug, status, userID}) {
        try {
            return await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    image,
                    status,
                    userID
                },
            )
            
            
        } catch (error) {
            console.log( "error", error);
        }
    }

    async updatePost({title, content, image, slug, status}) {
        try {
            return await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    image,
                    status
                }
            )
        } catch (error) {
            throw error;
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            )
            return true;
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            if (navigator.onLine) {
                const post = await this.databases.getDocument(
                    config.appwriteDatabaseId,
                    config.appwriteCollectionId,
                    slug
                )
                localStorage.setItem("post", JSON.stringify(post))
                return post;
            } else {
                const localPost = localStorage.getItem("post")
                if (localPost) {
                    return JSON.parse(localPost)
                }
            }
        } catch (error) {
            throw error;
        }
    }


    async getPosts(userData) {
        try {
            if (navigator.onLine) {
                const queries = [
                    Query.equal("status", "active"),
                    Query.equal("userID", userData)
                ]
                const posts = await this.databases.listDocuments(
                    config.appwriteDatabaseId,
                    config.appwriteCollectionId,
                    queries   
                )
                localStorage.setItem("posts", JSON.stringify(posts));
                return posts;
            } else {
                const localPosts = localStorage.getItem("posts");
                if (localPosts) {
                    return JSON.parse(localPosts);
                }
            }
        } catch (error) {
            console.log( "error", error);
        }
    }

    
    // file upload service

    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            throw error;
        }
    }

    async deleteFile(fileId) {
        try {
            return await this.bucket.deleteFile(
                config.appwriteBucketId,
                fileId
            )
        } catch (error) {
            throw error;
        }
    }

    getFileView(fileId) {
        try {
            return this.bucket.getFileView(
                config.appwriteBucketId,
                fileId
            )
        } catch (error) {
            console.log("kk", error);  
        }
    }
}

const service = new Service();
export default service;


