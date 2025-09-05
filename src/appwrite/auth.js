import config from "../config/config.js";
import { Client, Account, ID } from "appwrite";
export class AuthService {
    client = new Client();
    account;
    constructor() {
        this.client
            .setEndpoint(config.appwriteURL)
            .setProject(config.appwriteProjectId);
        this.account = new Account(this.client);
    }
    
    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // call another method to login
                return this.Login(email, password);
            } else {
                return userAccount
            }
        } catch (error) {
            console.log("appwrite service create account error : ", error);
        }
    }
    async Login({email, password}) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.log("appwrite service login error : ", error);
        }
        return null;
    }
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("appwrite service get current user error : ", error);  
        } 
        return null;
    }
    async Logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("appwrite service logout error : ", error);
        }
        return null;
    }
}
const authService = new AuthService();
export default authService







