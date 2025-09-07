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
            if (navigator.onLine) {
                const lgn = await this.account.createEmailPasswordSession(email, password);
                console.log(lgn);
                localStorage.setItem("lgn", JSON.stringify(lgn));
                return lgn;
            } else {
                const localLgn = localStorage.getItem("lgn")
                if (localLgn) {
                    return JSON.parse(localLgn)
                }
            }
        } catch (error) {
            console.log("appwrite service login error : ", error);
        }
    }
    
    async getCurrentUser() {
        try {
            if (navigator.onLine) {
                const user = await this.account.get();
                localStorage.setItem("user", JSON.stringify(user))
                return user;
            } else {
                const localUser = localStorage.getItem("user")
                if (localUser) {
                    return JSON.parse(localUser)
                }
            }
        } catch (error) {
            console.log("appwrite service get current user error : ", error);  
        }    
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







