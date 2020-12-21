export default class Model {

    constructor() {
        this.userListListeners = [];
        this.userList = ["Hans", "Fritz"];

        var fun = () => {
            console.log("Timeout");
            this.userList.push("Lukas");
            this.notifyUserListListeners();
            setTimeout(fun, 3000);
        }

        fun();

    }

    registerUserListListener(listener) {
        this.userListListeners.push(listener);
    }

    notifyUserListListeners() {
        for (const handler of this.userListListeners) {
            handler();
        }
    }

    getUserList() {
        return this.userList;
    }






}