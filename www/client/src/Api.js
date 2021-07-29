export default class {

    constructor() {
        this.baseURL = this.getRESTApiUri();
        this.headers = {
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        },
        this.tokenName = 'tarotclub-token';
    }

    /**************************************************************** 
     * API VARIOUS PATH GETTERS
     ****************************************************************/
    // API REST 
    getRESTApiUri()
    {
        let uri = this.getRootUrl() + "/api/v1";
        //console.log("REST API: " + uri);
        return uri;
    }

    getRootUrl()
    {
        let uri = window.location.protocol + "//" + window.location.hostname;
        return uri;
    }

    // API WEBSOCKET
    getWebSocketHost()
    {
        // let wsHost = (((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.hostname + '/clients');
        let wsHost = "wss://" + window.location.hostname + '/clients';
        
        //console.log("Web socket host: " + wsHost);
        return wsHost;
    }

    setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return "";
    }

    eraseCookie(name) {   
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    /**************************************************************** 
     * LOCAL STORAGE 
     ****************************************************************/
    async loadToken() {
        this.headers["Authorization"] = "Bearer "  + this.getCookie(this.tokenName);
    }

    async setToken(token) {
        this.setCookie(this.tokenName, token, 20);
        this.loadToken();
    }

    destroyToken() {
        this.eraseCookie(this.tokenName);
        this.loadToken();
    }

    /**************************************************************** 
     * API AUTHENTIFICATION 
     ****************************************************************/
    async signup(user) {
        return this.client('POST','/auth/signup', user);
    }

    async signin(user) {
        return this.client('POST','/auth/signin', user);
    }

    async setNewPassword(info) {
        return this.client('POST','/auth/newpassword', info);
    }

    async requestResetPassword(info) {
        return this.client('POST','/auth/resetpassword', info);
    }

    /**************************************************************** 
     * API DU PROFIL UTILISATEUR
     ****************************************************************/
     async setMyProfile(user) {
        return this.client('POST','/dashboard/user/profile', user);
    }

    async getMyProfile() {
        return this.client('GET','/dashboard/user/profile');
    }

    /**************************************************************** 
     * DIALOGUE AVEC DES SERVEURS DE JEU 
     ****************************************************************/
    async getAllServers() {
        return this.client('GET','/servers/list');
    }

    async joinServer(server) {
       return this.client('POST','/servers/join', {server: server});
    }

    /**************************************************************** 
     * CLIENT WRAPPER FOR REST API CALLS
     ****************************************************************/
     async fetchWithTimeout(resource, options) {
        
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), options.timeout);
      
        const response = await fetch(resource, {
          ...options,
          signal: controller.signal  
        });
        clearTimeout(id);
      
        return response;
      }


    async client(method, endpoint, body) {
        const options = {
            method: method,
            headers: this.headers,
            timeout: 8000
        }

        if (body) {
            options.body = JSON.stringify(body)
        }

        let uri =  this.baseURL + endpoint;

        try {
            const response = await this.fetchWithTimeout(uri, options);
            if (response.ok) {
                console.log(await response.clone().text());
                const resJeson = await response.json();
                return resJeson;
            } else {
                return Promise.reject(new Error('Invalid response'))
            }
        } catch (error) {
            // Timeouts if the request takes
            // longer than 6 seconds
            console.log(error);
            return Promise.reject(new Error('Invalid response'))

        }

    }

}
