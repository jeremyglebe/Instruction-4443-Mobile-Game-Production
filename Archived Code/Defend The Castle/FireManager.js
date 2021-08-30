let instance = null;
class FireManager {
    constructor() { };
    get(){
        if(instance == null){
            instance = new FireManager();
        }
        return instance;
    }
}